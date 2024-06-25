const {Service, Check, ServiceInCheck,Employee, User, Department, Appointment} = require('../models/models')
const {where} = require("sequelize");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')

class serviceController {
    async create(req, res){
        let preferredLang
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;
            const {Name, Info, Price, Lang} = req.body
            preferredLang = Lang

            const employee = await Employee.findOne({
                where: {UserUserId: UserId}
            })

            if(!employee){
                console.error("Employee is not found");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Employee is not found") });
            }

            const department = await Department.findOne({
                where: {DepartmentId: employee.DepartmentDepartmentId}
            })

            if(!department){
                console.error("Department is not found");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Department is not found") });
            }

            const service = await Service.create({
                DepartmentDepartmentId: department.DepartmentId,
                Name: Name,
                Info: Info,
                Price: Price
            })

            if(!service){
                console.error("Service is not found");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Service is not found") });
            }

            return res.json(service)
        }catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error") });
        }
    }

    async getWhereDepartment(req, res){
        let preferredLang = 'en'
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;

            const employee = await Employee.findOne({
                where: {UserUserId: UserId}
            })

            if(!employee){
                console.error("Employee is not found");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Employee is not found") });
            }

            const department = await Department.findOne({
                where: {DepartmentId: employee.DepartmentDepartmentId}
            })

            if(!department){
                console.error("Department is not found");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Department is not found") });
            }

            const service = await Service.findAll({
            where: {DepartmentDepartmentId: department.DepartmentId}

            })

            if(!service){
                console.error("Services is not found");
                return res.status(400).json({ error: languages.getLocalizedString(preferredLang, "Service is not found") });
            }

            return res.json(service)
        }catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({ error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error") });
        }
    }

    async update(req, res){
        let preferredLang
        try {
            const { ServiceId, Name, Info, Price, Lang } = req.body;
            preferredLang = Lang
            const service = await Service.findByPk(ServiceId);
            if (!service) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Service is not found")});
            }

            service.Name = Name;
            service.Info = Info;
            service.Price = Price;

            await service.save();

            return res.status(200).json(service);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async delete(req, res){
        let preferredLang
        try {
            const { ServiceId, Lang } = req.body;
            preferredLang = Lang
            const service = await Service.findByPk(ServiceId);
            if (!service) {
                return res.status(404).json({error: languages.getLocalizedString(preferredLang, "Service is not found")});
            }

            await service.destroy();

            return res.status(200).json({message: languages.getLocalizedString(preferredLang, "Service deleted")});
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async addToUserCheck(req, res){
        try {
            const {ServiceId, IOTCode, Count} = req.body
            const user = await User.findOne({
                where: {IOTCode: IOTCode}
            })

            const check = await Check.findOne({
                where: {UserUserId: user.UserId}
            })

            const serviceInCheck = await ServiceInCheck.create({
                Count: Count,
                CheckCheckId: check.CheckId,
                ServiceServiceId: ServiceId
            })
        }catch (e) {
            console.error("Unexpected error:", e);
        }
    }
}

module.exports = new serviceController()