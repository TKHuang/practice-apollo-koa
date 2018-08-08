const request = require('request-promise-native')
const jwt = require('jsonwebtoken')
const Boom = require('boom')
const debug = require('debug')('api:auth')

const { SSO_VALIDATE_URL } = process.env

const login = async ctx => {
  const { s } = ctx.query
  const reqOptions = {
    uri: SSO_VALIDATE_URL,
    qs: { s },
    json: true,
  }
  try {
    const { eid, firstName, lastName, email } = await request(reqOptions)
    const token = jwt.sign({ eid, firstName, lastName, email }, ctx.secret)
    debug(`User ${eid} ${firstName} ${lastName} logged in`)
    debug(`--> Email: ${email}`)
    ctx.cookies.set('token', token, { signed: true, httpOnly: true })
    ctx.body = { eid, firstName, lastName, email }
  } catch (e) {
    debug(e)
    const boom = Boom.boomify(e, { statusCode: e.statusCode, message: e.body })
    ctx.body = boom
  }
}

module.exports = {
  login,
}
