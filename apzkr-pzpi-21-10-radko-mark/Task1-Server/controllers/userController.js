const {User, Role, UserRole} = require('../models/models')
const {where} = require("sequelize");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')
const checkController = require('../controllers/checkController')
const generateJwt = (UserId, FirstName, SecondName, Email, PhoneNumber, BirthDay, IsBanned, PassportCode, IOTCode) => {
    return jwt.sign({UserId, FirstName, SecondName, Email, PhoneNumber, BirthDay, IsBanned, PassportCode, IOTCode},
        process.env.SECRET_KEY,
        {expiresIn: '24h' }) //alive
}
const generateIOTCode = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
};

const sendWelcomeEmail = (email, password) => {
    const mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: 'Welcome to our Company', //header
        text: 'Welcome to our company! Thank you for registering. Your Authorization keys:\n' + //main text
            'login: ' + email +'\n' + 'password: ' + password
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', //smtp
        port: 587,
        secure: false,
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.DB_PASSWORD
        }

    })
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            console.log('Error response:', error.response);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

class userController {
    async registration(req, res) {
        let preferredLang;
        try {
            const {
                FirstName, SecondName, Email, Password, PhoneNumber,
                BirthDay, PassportCode, Lang
            } = req.body;

            preferredLang = Lang;

            if (!FirstName || !SecondName || !Email || !Password || !PhoneNumber || !PassportCode || !BirthDay) {
                console.error("Some required fields are missing");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Bad Request - Some required fields are missing") });
            }

            const candidate = await User.findOne({
                where: {
                    Email: Email,
                    PhoneNumber: PhoneNumber
                }
            });

            if (candidate) {
                console.error("User already created");
                return res.status(409).json({ error: languages.getLocalizedString(preferredLang, "Conflict - User already created") });
            }

            const hashPassword = await bcrypt.hash(Password, 5);
            const IOTCode = generateIOTCode();

            const user = await User.create({
                FirstName: FirstName,
                SecondName: SecondName,
                Email: Email,
                Password: hashPassword,
                PhoneNumber: PhoneNumber,
                BirthDay: BirthDay,
                PassportCode: PassportCode,
                IOTCode: IOTCode
            });

            if (!user) {
                console.error("User not created");
                return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - User not created") });
            }

            const [clientRole, created] = await Role.findOrCreate({
                where: { RoleName: 'Client' },
                defaults: {
                    RoleDescription: 'This user can only be a client'
                }
            });

            await UserRole.create({
                UserUserId: user.UserId,
                RoleRoleId: clientRole.RoleId
            });

            const token = generateJwt(user.UserId, FirstName, SecondName, Email, PhoneNumber, BirthDay, user.IsBanned, PassportCode, IOTCode);

            if (!token) {
                console.error("Token not created");
                return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Token not created") });
            }

            sendWelcomeEmail(Email, Password);
            await checkController.create(req, res, user.UserId);
            
            return res.json("Registration successful");

        } catch (e) {
            console.error("Unexpected error:", e);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error") });
        }

    }

    async login(reg, res) {
        let preferredLang;
        try {
            const {Email, Password, Lang} = reg.body

            preferredLang = Lang;

            const user = await User.findOne({
                where: {Email: Email}
            })
            if (!user) {
                console.error("User is not found")
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "User is not found")})
            }

            if (user.IsBanned) {
                console.error("User is blocked")
                return res.status(402).json({error: languages.getLocalizedString(preferredLang, "User is blocked")})
            }

            let comparePassword = bcrypt.compareSync(Password, user.Password)
            if (!comparePassword) {
                console.error("Incorrect Password")
                return res.status(401).json({error: languages.getLocalizedString(preferredLang, "Incorrect password")});
            }
            const token = generateJwt(user.UserId, user.FirstName, user.SecondName, user.Email, user.PhoneNumber, user.BirthDay, user.IsBanned, user.PassportCode, user.IOTCode)
            return res.json({token})
        } catch (e) {
            console.error("Unexpected error:", e);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async ban(reg, res) {
        let preferredLang;
        try {
            const {UserId, Lang} = reg.body
            preferredLang = Lang;

            const user = await User.findOne({
                where: {UserId: UserId}
            })
            if (!user) {
                console.error("User is not found")
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "User is not found")})
            }

            await User.update({IsBanned: true}, {where: {UserId: UserId}});
            return res.json("User is banned")
        } catch (e) {
            console.error("Unexpected error:", e);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async unban(reg, res) {
        let preferredLang;
        try {
            const {UserId, Lang} = reg.body
            preferredLang = Lang;

            const user = await User.findOne({
                where: {UserId: UserId}
            })
            if (!user) {
                console.error("User is not found")
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "User is not found")})
            }

            await User.update({IsBanned: false}, {where: {UserId: UserId}});
            return res.json("User is unbanned")
        } catch (e) {
            console.error("Unexpected error:", e);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async check(reg, res) {
        try {
            const token = generateJwt(reg.user.UserId, reg.user.FirstName, reg.user.SecondName, reg.user.Email,
                reg.user.PhoneNumber, reg.user.BirthDay, reg.user.IsBanned, reg.user.PassportCode, reg.user.IOTCode)
            return res.json({token})
        } catch (e) {
            console.error(e)

        }
    }
    async getUserDetails(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;

            const user = await User.findOne({
                where: { UserId: UserId }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error('Error in getUserDetails:', error);
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async update(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const userId = decoded.UserId;

            const {
                FirstName, SecondName, PhoneNumber, BirthDay, PassportCode
            } = req.body;

            if (!FirstName || !SecondName || !PhoneNumber || !PassportCode || !BirthDay) {
                console.error("Some required fields are missing");
                return res.status(400).json({ error: 'Bad Request - Some required fields are missing' });
            }

            const user = await User.findOne({
                where: { UserId: userId }
            });

            if (!user) {
                console.error("User not found");
                return res.status(404).json({ error: 'User not found' });
            }

            user.FirstName = FirstName;
            user.SecondName = SecondName;
            user.PhoneNumber = PhoneNumber;
            user.BirthDay = BirthDay;
            user.PassportCode = PassportCode;

            await user.save();

            return res.json("User data updated successfully");

        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: 'Internal Server Error - Unexpected error' });
        }
    }

    async getWhereCode(req, res) {
        try{
            const {IOTCode} = req.body
            const user = await User.findOne({
                where: {IOTCode: IOTCode}
            })
            if(!user){
                return res.json("User not found")
            }

            return res.json(user)

        }catch (e) {
            console.error('Error fetching user by code:', e);
            return res.status(500).json({ message: 'Error fetching user by code' });
        }
    }
}

module.exports = new userController()