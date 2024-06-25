const Router = require('express')
const router = new Router()
const departmentController = require('../controllers/departmentController')

router.post('/', departmentController.create)
router.delete('/', departmentController.delete)
router.put('/search', departmentController.searchByAddress)
router.put('/', departmentController.update)
router.put('/details', departmentController.getDetails)
router.put('/company', departmentController.getWhereCompany)

module.exports = router