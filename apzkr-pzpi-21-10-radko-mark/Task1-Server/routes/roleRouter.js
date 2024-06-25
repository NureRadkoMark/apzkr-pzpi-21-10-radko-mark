const Router = require('express')
const router = new Router()
const roleController = require('../controllers/roleController')

router.post('/', roleController.create)
router.get('/all', roleController.getAll)
router.get('/user', roleController.getUserRole)
router.put('/role', roleController.setUserRole)

module.exports = router