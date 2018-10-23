const Router = require('koa-router')
const validate = require('koa2-validation')
const handler = require('./handler')
const v = require('./validate')

const router = new Router()

router.post('/login', handler.login)
router.post('/register', handler.register)
router.get('/logout', handler.logout)

module.exports = router
