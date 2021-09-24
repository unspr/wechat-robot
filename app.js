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
    // 'https://api.qrserver.com/v1/create-qr-code/?data=',
    'https://tool.oschina.net/action/qrcode/generate?data=',
    encodeURIComponent(qrcode),
    '&output=image/png&error=L&type=0&margin=0&size=4',
  ].join('')
})
bot.on('login',  user => {
  onLogin(user, bot)
  qrcodeImageUrl = ''
  if (user.name() !== '嗯呢') {
    bot.stop()
    console.log('bot stop')
  }
})
bot.on('message',   msg => onMessage(msg, bot))

try {
  bot.start()
} catch (e) {
  bot.stop()
  console.log('bot stop')
}

app.use(async (ctx, next) => {
  console.log(ctx.url)
  if (ctx.url !== '/wechat') {
    return
  }

  if (!qrcodeImageUrl) {
    return
  }

  ctx.response.type = 'html'
  ctx.body = `<div style="margin: 100px"><img src="${qrcodeImageUrl}"/></div>`
})

app.listen(3000)
