import Debug from 'debug'
import Koa from 'koa'
// import jwt from 'jsonwebtoken'
// import jwtDecode from 'jwt-decode'
import Logger from 'koa-logger'
import BodyParser from 'koa-bodyparser'
import Helmet from 'koa-helmet'
// import R from 'ramda'
// import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import { ApolloServer } from 'apollo-server-koa'
// import { execute, subscribe } from 'graphql'
// import { SubscriptionServer } from 'subscriptions-transport-ws'
// import { resolvers } from './schema/resolvers'
import { typeDefs, resolvers, mocks } from './schema/schema'

// import { executableSchema } from './schema/executableSchema'
import errHandler from './middlewares/errorHandler'
import router from './routes'

const debug = Debug('app:server')
const app = new Koa()

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
  engine: {
    apiKey: 'service:TKHuang-9721:UTVgmz_jbGAIaumqQ2ktkg',
  },
  context: async ({ ctx: { req }, connection }) => {
    console.log(`connection: ${connection}`)
  },
})

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
app.use(errHandler)
// API routes.
app.use(router.routes())

server.applyMiddleware({
  app,
})

app.listen(
  {
    port: 4000,
  },
  () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  },
)

// Setup the subscription server
// new SubscriptionServer(
//   {
//     subscriptionManager,
//     onSubscribe(message, params) {
//       setTimeout(() => {
//         resolvers.Book.findAll().forEach(book => {
//           subscriptionManager.pubsub.publish('bookAdded', book)
//         })
//       }, 0)
//       return Promise.resolve(params)
//     },
//   },
//   {
//     server,
//     path: '/graphql-sock',
//   },
// )
// SubscriptionServer.create(
//   {
//     schema: executableSchema,
//     execute,
//     subscribe,
//     onConnect: (connectionParams, socket) => {
//       try {
//         const { user } = jwt.verify(
//           connectionParams.authToken,
//           process.env.SECRET,
//         )
//         const jwtData = jwtDecode(connectionParams.authToken)
//         const timeout = jwtData.exp * 1000 - Date.now()
//         debug('authenticated', jwtData)
//         debug('set connection timeout', timeout)
//         setTimeout(() => {
//           // let the client reconnect
//           socket.close()
//         }, timeout)
//         return {
//           subscriptionUser: user,
//         }
//       } catch (error) {
//         debug('authentication failed', error.message)
//         return {
//           subscriptionUser: null,
//         }
//       }
//     },
//     onOperation(message, params) {
//       setTimeout(() => {
//         R.forEach(todo => {
//           pubsub.publish(TODO_UPDATED_TOPIC, {
//             todoUpdated: todo,
//           })
//           debug('publish', TODO_UPDATED_TOPIC, todo)
//         }, todos)
//       }, 0)
//       return Promise.resolve(params)
//     },
//   },
//   {
//     server,
//     path: '/graphql-sock',
//   },
// )
export default app
