const {Prescription, Employee} = require('../models/models')
const {where} = require("sequelize");
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')
const jwt = require('jsonwebtoken')

class prescriptionController {
    async create(req, res) {
        let preferredLang
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;

            const employee = await Employee.findOne({
                where: { UserUserId: UserId }
            });

            if (!employee) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Employee is not found")});
            }

            const EmployeeId = employee.EmployeeId;

            const { PetId, Body, Lang } = req.body;
            preferredLang = Lang

            if (!PetId || !Body) {
                console.error("Some required fields are missing")
                return res.status(400).json({error: languages.getLocalizedString(preferredLang, "Bad Request - Some required fields are missing")});
            }

            const newPrescription = await Prescription.create({ PetPetId: PetId, EmployeeEmployeeId: EmployeeId, Body });

            return res.status(201).json(newPrescription);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }
}

module.exports = new prescriptionController()