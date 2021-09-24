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

let qrcodeImageUrl
const bot = new Wechaty({ name })
bot.on('scan',  qrcode => {
  require('qrcode-terminal').generate(qrcode, { small: true })
  qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')
})
bot.on('login',  user => {
  onLogin(user, bot)
  qrcodeImageUrl = ''
})
bot.on('message',   msg => onMessage(msg, bot))

try {
  bot.start()
} catch (e) {
  bot.stop()
  console.log('bot stop')
}
const sleep = () => new Promise(r => setTimeout(r, 1000))

app.use(async (ctx, next) => {
  console.log(ctx.url)
  if (ctx.url !== '/wechat') {
    return
  }

  while (!qrcodeImageUrl) {
    await sleep()
  }

  ctx.response.type = 'html'
  ctx.body = `<img src="${qrcodeImageUrl}">`
})

app.listen(3000)
