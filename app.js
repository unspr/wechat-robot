/*
 * @Author: Peanut
 * @Description:  实例化 - 入口文件
 */
const { Wechaty } = require('wechaty')
const name = 'wechat-puppet-wechat'

const onScan = require('./listeners/on-scan.js')
const onLogin = require('./listeners/on-login.js')
const onMessage = require('./listeners/on-message.js')
const onFriendship = require('./listeners/on-friendship.js')

const bot = new Wechaty({
  name,
})

bot.on('login',  user => {
  onLogin(user, bot)
})
bot.on('message',  async msg => {
  await onMessage(msg, bot)
})
bot.on('scan',  (qrcode, status) => {
  onScan(qrcode, status)
})
bot.on('friendship',  friendship => {
  onFriendship(friendship)
})
bot
  .start()
  .then(() => console.log('开始登陆微信'))
  .catch(e => console.error(e))
