import Router from 'koa-router'
// import convert from 'koa-convert'
// import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
// import { ClientRequest } from 'http'
// import { executableSchema } from '../schema/executableSchema'

// import fs from 'fs-extra'
// import path from 'path'

import apiFormatter from '../middlewares/apiFormatter'
// import auth from './auth/route'

const apiRouter = new Router()
  .prefix('/api/v1')
  .use(apiFormatter)
  .get('/fuck', async ctx => {
    ctx.body = 'fuckkkkkkkkkkkkkk!'
  })

// const authRouter = new Router().prefix('/auth').use(auth.routes())
// const gqRouter = new Router().prefix('/graphql').post(
//   '/',
//   async (ctx, next) => {
//     console.log('fuckkkkkkkkkkkkkk')
//     await next()
//   },
//   async (ctx, next) => {
//     await convert(graphqlKoa({ schema: executableSchema }))(ctx, next)
//   },
// )

// const glRouter = new Router()
// glRouter.get('/graphql', graphqlKoa({ schema: executableSchema }))
// glRouter.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

// SPA route.
// const defaultRoute = new Router.all('*', async ctx => {
// ctx.set('Content-Type', 'text/html')
// ctx.set('charset', 'utf-8')
// ctx.body = await fs.readFile(path.join(__dirname, '../../public/index.html'))})

const exportRouter = new Router()
exportRouter.use(
  //   authRouter.routes(),
  apiRouter.routes(),
  //   gqRouter.routes(),
  //   glRouter.routes(),
  //   defaultRoute.routes(),
  exportRouter.allowedMethods(),
)

export default exportRouter
