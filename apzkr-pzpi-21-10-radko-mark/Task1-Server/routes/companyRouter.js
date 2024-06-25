const Router = require('express')
const router = new Router()
const companyController = require('../controllers/companyController')

router.post('/', companyController.create)
router.put('/', companyController.update)
router.delete('/', companyController.delete)
router.put('/details', companyController.getDetails)
router.get('/user', companyController.getWhereUser)
router.get('/admin', companyController.getWhereAdmin)

module.exports = router