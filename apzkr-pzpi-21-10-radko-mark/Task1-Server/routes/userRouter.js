const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', userController.registration)
router.post('/login', userController.login)
router.put('/ban', userController.ban)
router.put('/unban', userController.unban)
router.put('/update', userController.update)
router.get('/details', userController.getUserDetails)
router.get('/check', authMiddleware, userController.check)
router.put('/code', userController.getWhereCode)

module.exports = router