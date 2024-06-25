const {Pet} = require('../models/models')
const {where} = require("sequelize");
const nodemailer = require('nodemailer')
const languages = require('../locale/lang')
const jwt = require('jsonwebtoken')
class petController{
    async create(req, res){
        let preferredLang
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;

            const { Breed, AnimalType, Name, DocCode, DateBirth, Lang} = req.body;
            preferredLang = Lang
            if (!Breed || !AnimalType || !DocCode || !DateBirth || !UserId) {
                console.error("Some required fields are missing")
                return res.status(400).json({error: languages.getLocalizedString(preferredLang, "Bad Request - Some required fields are missing")});
            }

            const newPet = await Pet.create({
                Breed:Breed,
                AnimalType: AnimalType,
                Name:Name,
                DocCode: DocCode,
                DateBirth: DateBirth,
                UserUserId: UserId
            });

            return res.status(201).json(newPet);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async getWhereId(req, res){
        let preferredLang
        try {
            const { PetId , Lang} = req.body;
            preferredLang = Lang
            const pet = await Pet.findOne({
                where: { PetId: PetId }
            });

            return res.status(200).json(pet);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }

    async getWhereUser(req, res){
        let preferredLang
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const UserId = decoded.UserId;
            const { Lang } = req.body;
            preferredLang = Lang
            const pets = await Pet.findAll({
                where: { UserUserId: UserId }
            });

            return res.status(200).json(pets);
        } catch (error) {
            console.error("Unexpected error:", error);
            return res.status(500).json({error: languages.getLocalizedString(preferredLang, "Internal Server Error - Unexpected error")});
        }
    }


}

module.exports = new petController()