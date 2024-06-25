const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.post('/start', deviceController.deviceRequestStart)
router.post('/end', deviceController.deviceRequestEnd)

module.exports = router