const {Employee, Role, User, UserRole} = require('../models/models')
const {where} = require("sequelize");
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')

class employeeController {
    async create(req, res) {
        let preferredLang;
        try {
            const { NewRole, Description, DepartmentId, IOTCode, Lang } = req.body;
            preferredLang = Lang;
            const user = await User.findOne({
                where: { IOTCode: IOTCode }
            });

            if (!user) {
                console.error("User is not found");
                return res.status(404).json({ error: languages.getLocalizedString(preferredLang, "User is not found") });
            }

            const maybeEmployee = await Employee.findOne({
                where: { UserUserId: user.UserId }
            });

            if (maybeEmployee) {
                console.error(maybeEmployee);
                return res.json("Employee already created");
            }

            const employee = await Employee.create({
                UserUserId: user.UserId,
                Role: NewRole,
                Description: Description,
                DepartmentDepartmentId: DepartmentId
            });

            const role = await Role.findOne({
                where: { RoleName: NewRole }
            });

            if (!role) {
                return res.json("Role is incorrect");
            }

            let userRole = await UserRole.findOne({
                where: { UserUserId: user.UserId }
            });

            if (!userRole) {
                userRole = await UserRole.create({
                    UserUserId: user.UserId,
                    RoleRoleId: role.RoleId
                });
            } else {
                userRole.RoleRoleId = role.RoleId;
                await userRole.save();
            }

            return res.status(201).json(employee);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error") });
        }
    }

    async update (req, res){
        let preferredLang
        try {
            const { Role, Description, EmployeeId, Lang } = req.body;
            preferredLang = Lang
            const employee = await Employee.findOne({
                where: { EmployeeId: EmployeeId }
            });

            if (!employee) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Employee is not found")});
            }

            employee.Role = Role || employee.Role;
            employee.Description = Description || employee.Description;

            await employee.save();

            return res.status(200).json(employee);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async delete (req, res){
        let preferredLang
        try {
            const { EmployeeId, Lang } = req.body;
            preferredLang = Lang
            const employee = await Employee.findOne({
                where: { EmployeeId: EmployeeId }
            });

            if (!employee) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Employee is not found")});
            }

            const user = await User.findOne({
                where: {UserId: employee.UserUserId}
            })

            const role = await Role.findOne({
                where: {RoleName: 'Client'}
            })

            if(!role){
                return res.json("Role is incorrect")
            }

            const userRole = await UserRole.findOne({
                where: {UserUserId: user.UserId}
            })
            await employee.destroy();

            userRole.RoleRoleId = role.RoleId

            await userRole.save()
            return res.status(202).json({message: languages.getLocalizedString(preferredLang, "Employee deleted")});
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async getDoctorsWhereDepartment(req, res) {
        try {
            const { DepartmentId } = req.body;

            if (!DepartmentId) {
                return res.status(400).json({ error: 'DepartmentId is required' });
            }

            const employees = await Employee.findAll({
                where: { DepartmentDepartmentId: DepartmentId,
                Role: "Doctor"}
            });

            if (employees.length === 0) {
                return res.status(404).json({ message: 'No employees found in this department' });
            }

            return res.status(200).json(employees);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while fetching employees' });
        }
    }

    async getWhereDepartment (req, res){
        try {
            const { DepartmentId } = req.body;

            if (!DepartmentId) {
                return res.status(400).json({ error: 'DepartmentId is required' });
            }

            const employees = await Employee.findAll({
                include: User,
                where: { DepartmentDepartmentId: DepartmentId}
            });

            if (employees.length === 0) {
                return res.status(404).json({ message: 'No employees found in this department' });
            }

            return res.status(200).json(employees);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while fetching employees' });
        }
    }

}

module.exports = new employeeController()