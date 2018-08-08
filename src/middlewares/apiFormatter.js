import Debug from 'debug'
import Boom from 'boom'

const debug = Debug('responseHandler')

export default async (ctx, next) => {
  try {
    ctx.formatResponse = true
    await next()
  } catch (err) {
    debug(err)
    ctx.body = Boom.badImplementation()
  }

  if (!ctx.formatResponse) return

  if (Boom.isBoom(ctx.body)) {
    const { payload } = ctx.body.output
    ctx.status = payload.statusCode
    ctx.body = {
      code: payload.statusCode,
      message: payload.message,
      error: payload.error,
    }
    return
  }
  ctx.body = {
    code: 200,
    message: 'success',
    data: ctx.body,
  }
}
