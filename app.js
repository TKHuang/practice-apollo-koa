// const { ApolloServer, gql } = require('apollo-server')
const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const { resolvers, typeDefs, mocks } = require('./schema/schema.js')

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
  context: ({ ctx: { req } }) => {
    console.log(req.headers)
  },
})

const app = new Koa()
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
})
// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
// server.listen().then(({ url }) => {
// console.log(`🚀  Server ready at ${url}`)
// })
