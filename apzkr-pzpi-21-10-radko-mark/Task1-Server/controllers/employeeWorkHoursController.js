const {Employee, EmployeeWorkHours, User} = require('../models/models')
const {where} = require("sequelize");
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')

class employeeWorkHoursController {
    async createStartTime(UserId, Lang, req, res) {
        let preferredLang;
        try {
            preferredLang = Lang;
            const user = await User.findOne({
                where: { UserId: UserId }
            });

            if (!user) {
                console.error("User is not found");
                return res.status(404).send("User not found");
            }

            const employee = await Employee.findOne({
                where: { UserUserId: UserId }
            });

            if (!employee) {
                console.error("Employee is not found");
                return res.status(404).send("Employee not found");
            }

            const currentDate = new Date().toISOString().split('T')[0]; // Current date in form: YYYY-MM-DD

            // Get the current time in 'HH:MM:SS' format
            const currentTime = new Date().toTimeString().split(' ')[0];

            const newWorkHourRecord = await EmployeeWorkHours.create({
                EmployeeEmployeeId: employee.EmployeeId,
                WorkDate: currentDate,
                StartTime: currentTime, // Current time in 'HH:MM:SS' format
                createdAt: new Date(),
                updatedAt: new Date()
            });

        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }

    async updateEndTime(req, res, UserId){
        try {
            const user_second = await User.findOne({
                where: { UserId: UserId }
            });

            if (!user_second) {
                console.error("User is not found");
            }

            const employee = await Employee.findOne({
                where: { UserUserId: UserId }
            });

            if (!employee) {
                console.error("Employee is not found");
            }

            const currentDate = new Date().toISOString().split('T')[0]; // Current date in form: YYYY-MM-DD

            const workHoursRecord = await EmployeeWorkHours.findOne({
                where: {
                    EmployeeEmployeeId: employee.EmployeeId,
                    WorkDate: currentDate,
                    EndTime: null
                }
            });

            if (!workHoursRecord) {
                console.error("Element work hours is not found")
            }

            workHoursRecord.EndTime = new Date().toISOString(); // Current time

            await workHoursRecord.save();

        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }

    async getWhereDepartment(req, res) {
        try {
            const { DepartmentId } = req.body;

            const employeeWorkHours = await EmployeeWorkHours.findAll({
                include: [
                    {
                        model: Employee,
                        where: { DepartmentDepartmentId: DepartmentId },
                        include: [
                            {
                                model: User
                            }
                        ]
                    }
                ]
            });

            if (!employeeWorkHours) {
                return res.json("Employee work hours not found");
            }

            return res.json(employeeWorkHours);
        } catch (e) {
            console.error("Unexpected error", e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

}

module.exports = new employeeWorkHoursController()