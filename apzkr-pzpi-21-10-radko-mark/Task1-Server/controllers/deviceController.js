const {User, Employee} = require('../models/models')
const {where} = require("sequelize");
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')
const employeeWorkHoursController = require('../controllers/employeeWorkHoursController')

class deviceController {
    async deviceRequestStart(req, res){
        try {
            const { IOTCode, Lang } = req.body;

            const user = await User.findOne({
                where: { IOTCode: IOTCode }
            });

            if (!user) {
                return res.status(404).json({ exists: false });
            }

            const employee = await Employee.findOne({
                where: { UserUserId: user.UserId }
            });

            if (!employee) {
                return res.status(200).json({ exists: true, isEmployee: false });
            }

            // If user is employee
            await employeeWorkHoursController.createStartTime(user.UserId, Lang, req, res);
            return res.status(200).json({ exists: true, isEmployee: true });
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ message: "Internal Server Error - Unexpected error" });
        }
    }

    async deviceRequestEnd(req, res){
        try {
            const { IOTCode } = req.body;

            const user_second = await User.findOne({
                where: { IOTCode: IOTCode }
            });

            if (!user_second) {
                return res.status(404).json({ exists: false });
            }

            const employee = await Employee.findOne({
                where: { UserUserId: user_second.UserId }
            });

            if (!employee) {
                return res.status(200).json({ exists: true, isEmployee: false });
            }

            // If user is employee
            await employeeWorkHoursController.updateEndTime(req, res, user_second.UserId);

        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ message: "Internal Server Error - Unexpected error" });
        }
    }
}

module.exports = new deviceController()