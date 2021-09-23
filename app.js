/*
 * @Author: Peanut
 * @Description:  实例化 - 入口文件
 */
const { Wechaty } = require('wechaty')
const name = 'wechat-puppet-wechat'
const _ = require('lodash')
const onScan = require('./listeners/on-scan.js')
const onLogin = require('./listeners/on-login.js')
const onMessage = require('./listeners/on-message.js')
const onFriendship = require('./listeners/on-friendship.js')

const Koa = require('koa')
const app = new Koa()
app.use(async (ctx, next) => {
  console.log(ctx.url)
  if (!_.includes(ctx.url, 'wechat')) {
    return
  }

  let ret = false
  const bot = new Wechaty({ name })
  bot.on('login',  user => onLogin(user, bot))
  bot.on('message',  async msg => {
    await onMessage(msg, bot)
  })
  bot.on('scan',  qrcode => {
    require('qrcode-terminal').generate(qrcode, { small: true })
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')

    ctx.response.type = 'html'
    ctx.body = `<img src="${qrcodeImageUrl}">`
    ret = true
  })
  bot.on('friendship',  friendship => onFriendship(friendship))
  bot.start()
    .catch(() => bot.stop())

  const sleep = () => new Promise(resolve => setTimeout(function () { resolve(1) }, 1000))
  while (!ret) {
    await sleep()
  }
})

app.listen(80)
