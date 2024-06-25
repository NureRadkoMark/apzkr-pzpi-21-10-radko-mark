const {Service, ServiceInCheck,Check,Employee, User, Department} = require('../models/models')
const {where} = require("sequelize");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')



class checkController {
    constructor() {
        this.calculateTotalAmount = this.calculateTotalAmount.bind(this);
        this.create = this.create.bind(this);
        this.getWhereUser = this.getWhereUser.bind(this);
        this.getWhereDepartment = this.getWhereDepartment.bind(this);
    }

    async calculateTotalAmount(checkId) {
        try {
            console.log(`Calculating total amount for checkId: ${checkId}`);

            // Get services in the check from DB
            const servicesInCheck = await ServiceInCheck.findAll({
                where: { CheckCheckId: checkId },
                include: [
                    {
                        model: Service
                    }
                ]
            });

            if (!servicesInCheck || servicesInCheck.length === 0) {
                console.warn(`No services found for the given checkId: ${checkId}`);
                return 0; // Return 0 if no services found
            }

            console.log(`Found ${servicesInCheck.length} services in the check`);

            const totalAmount = servicesInCheck.reduce((total, serviceInCheck) => {
                if (!serviceInCheck.Service) {
                    console.error('Service not found for serviceInCheck:', serviceInCheck);
                    throw new Error('Service not found for serviceInCheck');
                }
                return total + (serviceInCheck.Service.Price * serviceInCheck.Count);
            }, 0);

            return totalAmount;
        } catch (error) {
            console.error('Error in calculateTotalAmount:', error);
            return 0; // Return 0 in case of any error
        }
    }

    async create(req, res, UserId){
        try {
            const newCheck = await Check.create({
                UserUserId: UserId
            });
        } catch (error) {
            console.error('Error where creating a check:', error);
        }
    }

    async getWhereUser(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;
            const check = await Check.findOne({
                where: { UserUserId: UserId },
                include: [
                    {
                        model: Service,
                        through: {
                            model: ServiceInCheck
                        },
                        include: [Department]
                    }
                ]
            });

            if (!check) {
                return res.status(404).json({ message: 'Check is not found' });
            }

            const totalAmount = await this.calculateTotalAmount(check.CheckId);
            const servicesWithDepartments = check.Services.map(service => ({
                serviceName: service.Name,
                departmentName: service.Department.Name,
                price: service.Price,
                count: service.ServiceInCheck.Count,
                total: service.Price * service.ServiceInCheck.Count
            }));

            const checkWithDetails = {
                ...check.toJSON(),
                totalAmount,
                services: servicesWithDepartments
            };

            return res.status(200).json(checkWithDetails);
        } catch (error) {
            console.error('Error with getting a check:', error);
            return res.status(500).json({ message: 'Error with getting a check' });
        }
    }

    async getWhereDepartment(req, res) {
        try {
            const { departmentId } = req.params;
            const checks = await Check.findAll({
                include: [
                    {
                        model: Service,
                        where: { DepartmentDepartmentId: departmentId },
                        through: {
                            model: ServiceInCheck
                        },
                        include: [Department]
                    }
                ]
            });

            if (!checks || checks.length === 0) {
                return res.status(404).json({ message: 'Check not found' });
            }

            const checksWithDetails = await Promise.all(checks.map(async (check) => {
                const totalAmount = await this.calculateTotalAmount(check.CheckId);
                const servicesWithDepartments = check.Services.map(service => ({
                    serviceName: service.Name,
                    departmentName: service.Department.Name,
                    price: service.Price,
                    count: service.ServiceInCheck.Count,
                    total: service.Price * service.ServiceInCheck.Count
                }));

                return {
                    ...check.toJSON(),
                    totalAmount,
                    services: servicesWithDepartments
                };
            }));

            return res.status(200).json(checksWithDetails);
        } catch (error) {
            console.error('Error with getting a check:', error);
            return res.status(500).json({ message: 'Error with getting a check' });
        }
    }

}

module.exports = new checkController();
