const Router = require('koa-router')
const validate = require('koa2-validation')
const handler = require('./handler')
const v = require('./validate')

const router = new Router()

router.get('/login', validate(v.login), handler.login)

module.exports = router
