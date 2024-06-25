const Router = require('express')
const router = new Router()
const serviceController = require('../controllers/serviceController')

router.post('/', serviceController.create)
router.put('/', serviceController.update)
router.delete('/', serviceController.delete)
router.put('/user', serviceController.addToUserCheck)
router.get('/department', serviceController.getWhereDepartment)

module.exports = router