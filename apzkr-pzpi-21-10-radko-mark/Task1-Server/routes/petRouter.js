const Router = require('express')
const router = new Router()
const petController = require('../controllers/petController')

router.post('/', petController.create)
router.get('/user', petController.getWhereUser)
router.get('/id', petController.getWhereId)

module.exports = router