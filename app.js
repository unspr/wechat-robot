/*
 * @Author: Peanut
 * @Description:  实例化 - 入口文件
 */
const { Wechaty } = require('wechaty')
const name = 'wechat-puppet-wechat'
const _ = require('lodash')
const onLogin = require('./listeners/on-login.js')
const onMessage = require('./listeners/on-message.js')

const Koa = require('koa')
const app = new Koa()

let globalCtx
const bot = new Wechaty({ name })
bot.on('scan',  qrcode => {
  require('qrcode-terminal').generate(qrcode, { small: true })
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')
  bot.on('login',  user => onLogin(user, bot))
  bot.on('message',   msg => onMessage(msg, bot))

  globalCtx.response.type = 'html'
  globalCtx.body = `<img src="${qrcodeImageUrl}">`
})
const sleep = () => new Promise(r => setTimeout(r, 1000))

app.use(async (ctx, next) => {
  console.log(ctx.url)
  if (ctx.url !== '/wechat') {
    return
  }

  globalCtx = ctx
  try {
    await bot.start()
  } catch (e) {
    await bot.stop()
    console.log('bot stop')
  }

  while (!ctx.body) {
    await sleep()
  }
})

app.listen(3000)
