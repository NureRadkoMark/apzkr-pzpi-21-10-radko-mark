const Router = require('express')
const router = new Router()

const appointmentRouter = require('./appointmentRouter')
const companyRouter = require('./companyRouter')
const departmentRouter = require('./departmentRouter')
const employeeRouter = require('./employeeRouter')
const petRouter = require('./petRouter')
const prescriptionRouter = require('./prescriptionRouter')
const roleRouter = require('./roleRouter.js')
const userRouter = require('./userRouter')
const userRoleRouter = require('./backupRouter')
const deviceRouter = require('./deviceRouter')
const serviceRouter = require('./serviceRouter')
const checkRouter = require('./checkRouter')



router.use('/appointment', appointmentRouter)
router.use('/company', companyRouter)
router.use('/department', departmentRouter)
router.use('/employee', employeeRouter)
router.use('/pet', petRouter)
router.use('/prescription', prescriptionRouter)
router.use('/role', roleRouter)
router.use('/user', userRouter)
router.use('/userRole', userRoleRouter)
router.use('/device', deviceRouter)
router.use('/service', serviceRouter)
router.use('/check', checkRouter)


module.exports = router