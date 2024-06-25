const {Role, UserRole} = require('../models/models')
const {where} = require("sequelize");
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')
const jwt = require("jsonwebtoken");

class roleController {
    async create(req, res) {
        let preferredLang
        try {
            const { RoleName, RoleDescription, Lang} = req.body;

            preferredLang = Lang

            if (!RoleName || !RoleDescription) {
                console.error("Some required fields are missing")
                return res.status(400).json({error: languages.getLocalizedString(preferredLang, "Bad Request - Some required fields are missing")});
            }

            const newRole = await Role.create({
                RoleName: RoleName,
                RoleDescription: RoleDescription });

            return res.status(201).json(newRole);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async getAll(req, res) {
        let preferredLang
        try {
            const {Lang} = req.body
            preferredLang = Lang
            const roles = await Role.findAll();

            return res.status(200).json(roles);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async getUserRole(req, res) {
        let preferredLang;
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;
            const { Lang } = req.body;
            preferredLang = Lang;

            const userRole = await UserRole.findOne({
                where: { UserUserId: UserId }
            });

            if (!userRole) {
                console.error("User role is not found");
                return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "User role is not found") });
            }

            const role = await Role.findOne({
                where: { RoleId: userRole.RoleRoleId }
            });

            if (!role) {
                console.error("Role is not found");
                return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Role is not found") });
            }

            return res.status(200).json({ role: role });
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error") });
        }
    }

    async setUserRole(req, res) {
        let preferredLang;
        const { UserId, Lang, Role: newRole } = req.body;
        preferredLang = Lang;

        try {
            const role = await Role.findOne({
                where: { RoleName: newRole }
            });

            if (!role) {
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Role not found") });
            }

            const existingUserRole = await UserRole.findOne({
                where: { UserUserId: UserId }
            });

            if (existingUserRole) {
                if (existingUserRole.RoleRoleId === role.RoleId) {
                    return res.status(200).json({ message: languages.getLocalizedString(preferredLang, "User already has this role") });
                } else {
                    await existingUserRole.update({ RoleRoleId: role.RoleId });
                    return res.status(200).json({ message: languages.getLocalizedString(preferredLang, "User role updated successfully") });
                }
            } else {
                await UserRole.create({
                    UserUserId: UserId,
                    RoleRoleId: role.RoleId
                });
                return res.status(201).json({ message: languages.getLocalizedString(preferredLang, "User role created successfully") });
            }
        } catch (error) {
            console.error("Error setting user role:", error);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal server error") });
        }
    }

}

module.exports = new roleController()