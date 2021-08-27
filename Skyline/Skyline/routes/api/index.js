const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')
const auth = require('./auth')
const user = require('./user')
const admin = require('./admin')
const element = require('./elements')
const package = require('./package')
const sellvoucher = require('./sellvoucher')
const terms = require('./terms')

router.use('/auth', auth)
router.use('/user', user)
router.use('/admin', admin)
router.use('/element', element)
router.use('/package', package)
router.use('/sellvoucher', sellvoucher)
router.use('/terms', terms)



module.exports = router