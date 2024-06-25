const {Department} = require('../models/models')
const {where} = require("sequelize");
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')
const {Op} = require('sequelize')

class departmentController {
    async create(req, res) {
        let preferredLang;
        try {
            const { Address, StartWorkingTime, EndWorkingTime, Name, Info, PhoneNumber, CompanyId, Lang } = req.body;
            preferredLang = Lang;

            // Check if all required fields are provided
            if (!Address || !StartWorkingTime || !EndWorkingTime || !Name || !PhoneNumber || !CompanyId) {
                console.error("Some required fields are missing");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Bad Request - Some required fields are missing") });
            }

            // Validate time format
            const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (!timePattern.test(StartWorkingTime) || !timePattern.test(EndWorkingTime)) {
                console.error("Invalid time format");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Bad Request - Invalid time format") });
            }

            // Validate phone number format (assuming it should be between 7 and 15 digits)
            const phonePattern = /^\d{7,15}$/;
            if (!phonePattern.test(PhoneNumber)) {
                console.error("Invalid phone number format");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Bad Request - Invalid phone number format") });
            }

            // Check length constraints for fields (e.g., maximum length for Name and Address)
            if (Name.length > 100 || Address.length > 255) {
                console.error("Name or Address too long");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Bad Request - Name or Address too long") });
            }

            // Create the department record
            const department = await Department.create({
                Address: Address,
                StartWorkingTime: StartWorkingTime,
                EndWorkingTime: EndWorkingTime,
                Name: Name,
                Info: Info,
                PhoneNumber: PhoneNumber,
                CompanyCompanyId: CompanyId
            });

            return res.status(201).json(department);
        } catch (error) {
            // Handle Sequelize validation errors
            if (error.name === 'SequelizeValidationError') {
                console.error("Validation error:", error.errors);
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Bad Request - Validation error") });
            }

            // Handle database errors
            if (error.name === 'SequelizeDatabaseError') {
                console.error("Database error:", error);
                return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Database error") });
            }

            // Handle authentication errors
            if (error.name === 'JsonWebTokenError') {
                console.error("Authentication error:", error);
                return res.status(401).json({ error: languages.getLocalizedString(preferredLang, "Unauthorized - Invalid token") });
            }

            // Handle all other unexpected errors
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error") });
        }
    }

    async update (req, res){
        let preferredLang
        try {
            const { Address, StartWorkingTime, EndWorkingTime, Name, Info, PhoneNumber, DepartmentId, Lang } = req.body;
            preferredLang = Lang
            const department = await Department.findOne({
                where: { DepartmentId: DepartmentId }
            });
            if (!department) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Department is not found")});
            }

            department.Address = Address;
            department.StartWorkingTime = StartWorkingTime;
            department.EndWorkingTime = EndWorkingTime;
            department.Name = Name;
            department.Info = Info;
            department.PhoneNumber = PhoneNumber;

            await department.save();

            return res.status(200).json(department);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async delete (req, res){
        let preferredLang
        try {
            const { DepartmentId, Lang } = req.body;
            preferredLang = Lang
            const department = await Department.findOne({
                where: { DepartmentId: DepartmentId }
            });
            if (!department) {
                return res.status(404).json({ message: "Department is not found" });
            }

            await department.destroy();

            return res.status(200).json({ message: "department was deleted" });
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async searchByAddress(req, res) {
        let preferredLang
        try {
            const { Address, Lang } = req.body;
            preferredLang = Lang
            if (!Address) {
                return res.status(400).json({ message: "No address specified" });
            }

            const departments = await Department.findAll({
                where: {
                    Address: {
                        [Op.like]: `%${Address}%`
                    }
                }
            });

            if (!departments || departments.length === 0) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Department is not found")});
            }

            return res.status(200).json(departments);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async getDetails(req, res) {
        let preferredLang;
        try {
            const { DepartmentId, Lang } = req.body;
            preferredLang = Lang;

            const department = await Department.findOne({
                where: { DepartmentId: DepartmentId }
            });

            if (!department) {
                return res.status(404).json({ error: languages.getLocalizedString(preferredLang, "Department is not found") });
            }

            return res.status(200).json(department);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error") });
        }
    }

    async getWhereCompany(req, res){
        try {
            const {CompanyId} = req.body

            const departments = await Department.findAll({
                where: {CompanyCompanyId: CompanyId}
            })
            if (!departments) {
                return res.json("Departments not found")
            }
            return res.json(departments)
        }catch (e) {
            console.error(e)
        }
    }
}

module.exports = new departmentController()