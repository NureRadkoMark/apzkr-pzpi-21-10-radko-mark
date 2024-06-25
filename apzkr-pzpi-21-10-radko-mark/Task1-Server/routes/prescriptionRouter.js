const Router = require('express')
const router = new Router()
const prescriptionController = require('../controllers/prescriptionController')

router.post('/', prescriptionController.create)

module.exports = router