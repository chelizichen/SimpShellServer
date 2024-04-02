const Koa = require('koa')
const serve = require('koa-static')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')
const c2k = require('koa-connect')
const Router = require('koa-router')
const mount = require('koa-mount')
const path = require('path')
const { RPCServer, isConfigured, noLogin } = require('./server/RPCServer')
const { NewSimpHttpServer } = require('./lib/index')
const server = new Koa()
server.use(bodyParser())
server.use(async (ctx, next) => {
  console.log('ctx',ctx.url);
  try {
    ctx.req.body = ctx.request.body
    await next()
  } catch (err) {
    ctx.status = 500
    ctx.message = err.message || 'Sorry, an error has occurred.'
  }
})

const publicPath = '/simpshellserver'

server.use(views(path.join(__dirname, './views'), {
  extension: 'pug',
}))

server.use(mount('/simpshellserver/static', serve(path.join(__dirname, './static'))))

const router = new Router({
  'prefix':publicPath
})

router.get('/console', async (ctx) => {
  if (isConfigured) {
    await ctx.render('index', {
      NO_LOGIN: noLogin
    })
  } else {
    await ctx.render('unauthorized')
  }
})
router.post('/rpc', c2k(RPCServer.middleware()))

server.use(router.routes()).use(router.allowedMethods())

NewSimpHttpServer(server)