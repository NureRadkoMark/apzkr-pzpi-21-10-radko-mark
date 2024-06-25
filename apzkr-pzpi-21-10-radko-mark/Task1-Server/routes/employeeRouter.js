const Router = require('express')
const router = new Router()
const employeeController = require('../controllers/employeeController')
const employeeWorkHours = require('../controllers/employeeWorkHoursController')

router.post('/', employeeController.create)
router.put('/', employeeController.update)
router.delete('/', employeeController.delete)
router.get('/department/doctors', employeeController.getDoctorsWhereDepartment)
router.put('/department', employeeController.getWhereDepartment)
router.put('/hours/department', employeeWorkHours.getWhereDepartment)

module.exports = router