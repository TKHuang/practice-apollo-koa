import Debug from 'debug'
import Koa from 'koa'
import http from 'http'
import Logger from 'koa-logger'
import BodyParser from 'koa-bodyparser'
import Helmet from 'koa-helmet'
import { ApolloServer } from 'apollo-server-koa'
import schema, { mocks } from './schema/schema'
import errHandler from './middlewares/errorHandler'
import router from './routes'
import db from './db'
import { verifyToken } from './utils/jwt'

const debug = Debug('app:server')
const app = new Koa()

debug('start server!!!')

app.use(Helmet())
app.use(Logger())
app.use(
  BodyParser({
    enableTypes: ['json', 'form'],
    jsonLimit: '5mb',
    strict: true,
    onerror: (err, ctx) => ctx.throw('body parse error', 422),
  }),
)

// app.use(passport.initialize())
app.use(errHandler)
// API routes.
app.use(router.routes())

// Workaround for disappear cursor in playground.
const playground = {
  settings: {
    'editor.cursorShape': 'line',
  },
}
const apoServer = new ApolloServer({
  schema,
  mocks,
  engine: {
    apiKey: 'service:TKHuang-9721:UTVgmz_jbGAIaumqQ2ktkg',
  },
  context: async ({ ctx, connection }) => {
    if (connection) {
      // check connection for metadata
      debug('subscription connection created.')
      return {}
    }

    debug('Normal request.')
    // check from req
    const token = ctx.req.headers.authorization || ''
    let context = {}
    if (token) {
      try {
        const decoded = verifyToken(token)
        debug('decoded token:', JSON.stringify(decoded, null, 2))
        context = {
          user: decoded,
          db,
        }
      } catch (err) {
        debug(err)
      }
    }
    return context
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket) => {},
  },
  playground,
})
apoServer.applyMiddleware({
  app,
})

const httpServer = http.createServer(app.callback())
apoServer.installSubscriptionHandlers(httpServer)

httpServer.listen(
  {
    port: 4000,
  },
  () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apoServer.graphqlPath}`,
    )
  },
)

export default app
