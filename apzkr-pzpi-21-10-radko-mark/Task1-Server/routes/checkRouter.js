const Router = require('express')
const router = new Router()
const checkController = require('../controllers/checkController')
const {application} = require("express");

router.post('/new', checkController.create)
router.get('/department', checkController.getWhereDepartment)
router.get('/user', checkController.getWhereUser)


module.exports = router