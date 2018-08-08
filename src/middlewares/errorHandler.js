const Boom = require('boom')
const debug = require('debug')('api:Error')

export default async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    debug(err)
    ctx.body = Boom.badImplementation()
  }
}
