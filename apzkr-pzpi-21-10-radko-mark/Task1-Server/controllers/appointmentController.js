const {Appointment, Department, Pet, Employee, User} = require('../models/models')
const {where} = require("sequelize");
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')
const moment = require('moment');
moment.tz.setDefault('Europe/Kiev');

class appointmentController {
    async create(req, res) {
        let preferredLang;
        try {
            const { PetId, DateAndTime, DepartmentId, Lang } = req.body;
            let dateAndTime;
            preferredLang = Lang;

            const parsedDate = moment(DateAndTime, 'YYYY-MM-DD HH:mm', true);
            if (!parsedDate.isValid()) {
                return res.status(400).json({ error: 'Invalid date format' });
            }
            dateAndTime = parsedDate.toDate();

            if (moment(dateAndTime).isBefore(moment())) {
                return res.status(400).json({ error: 'Appointment time must be in the future' });
            }

            const department = await Department.findByPk(DepartmentId);
            if (!department) {
                return res.status(404).json({ error: 'Department not found' });
            }

            const startWorkingTime = moment(department.StartWorkingTime, 'HH:mm');
            const endWorkingTime = moment(department.EndWorkingTime, 'HH:mm');

            const appointmentTime = moment(dateAndTime).format('HH:mm');

            if (appointmentTime < startWorkingTime.format('HH:mm') || appointmentTime > endWorkingTime.format('HH:mm')) {
                return res.status(400).json({ error: 'Appointment time is outside of department working hours' });
            }

            const doctors = await Employee.findAll({
                where: {
                    DepartmentDepartmentId: DepartmentId,
                    Role: 'Doctor'
                }
            });

            let selectedDoctor = null;
            for (const doctor of doctors) {
                const existingAppointment = await Appointment.findOne({
                    where: {
                        EmployeeEmployeeId: doctor.EmployeeId,
                        DateAndTime: {
                            [Op.and]: [
                                { [Op.gte]: moment(dateAndTime).subtract(15, 'minutes').toDate() },
                                { [Op.lte]: moment(dateAndTime).add(15, 'minutes').toDate() }
                            ]
                        }
                    }
                });
                if (!existingAppointment) {
                    selectedDoctor = doctor;
                    break;
                }
            }

            if (selectedDoctor) {
                const appointment = await Appointment.create({
                    EmployeeEmployeeId: selectedDoctor.EmployeeId,
                    PetPetId: PetId,
                    DateAndTime: dateAndTime
                });
                return res.status(201).json(appointment);
            } else {
                return res.status(404).json({ error: 'No available appointment' });
            }

        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req, res) {
        let preferredLang
        try {
            const { AppointmentId, PetId, DateAndTime, Lang } = req.body;
            preferredLang = Lang
            const appointment = await Appointment.findByPk(AppointmentId);
            if (!appointment) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Appointment not found")});
            }

            appointment.PetId = PetId;
            appointment.DateAndTime = DateAndTime;

            await appointment.save();

            return res.status(200).json(appointment);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async delete(req, res){
        let preferredLang
        try {
            const { AppointmentId, Lang } = req.body;
            preferredLang = Lang
            const appointment = await Appointment.findByPk(AppointmentId);
            if (!appointment) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Appointment not found")});
            }

            await appointment.destroy();

            return res.status(404).json({message: languages.getLocalizedString(preferredLang, "Appointment deleted")});
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async getWhereUser(req, res){
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;

            const appointments = await Appointment.findAll({
                include: [
                    {
                        model: Pet,
                        where: { UserUserId: UserId }
                    },
                    {
                        model: Employee,
                        include: [
                            {
                                model: Department,
                                foreignKey: 'EmployeeEmployeeId'
                            },
                            {
                                model: User,
                                foreignKey: 'UserUserId'
                            }
                        ]
                    }
                ]
            });


            return res.status(200).json(appointments);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString('en', "Internal Server Error - Unexpected error")});
        }
    }

    async getWhereEmployee(req, res){
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;

            const employee = await Employee.findOne({
                where: { UserUserId: UserId }
            });
            if (!employee) {
                return res.status(404).json({error: languages.getLocalizedString('en', "Employee is not found")});
            }

            const appointments = await Appointment.findAll({
                include: [
                    {
                        model: Pet
                    },
                    {
                        model: Employee,
                        include: [
                            {
                                model: Department,
                                foreignKey: 'EmployeeEmployeeId'

                            },
                            {
                                model: User,
                                foreignKey: 'UserUserId'
                            }
                        ],
                        where: {EmployeeId: employee.EmployeeId}
                    }
                ]
            });

            return res.status(200).json(appointments);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString('en', "Internal Server Error - Unexpected error")});
        }
    }
}

module.exports = new appointmentController()