const Router = require('express')
const router = new Router()
const appointmentController = require('../controllers/appointmentController')

router.post('/', appointmentController.create)
router.put('/update', appointmentController.update)
router.delete('/', appointmentController.delete)
router.get('/user', appointmentController.getWhereUser)
router.get('/employee', appointmentController.getWhereEmployee)

module.exports = router