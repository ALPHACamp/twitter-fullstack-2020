const routes = require('./routes')
const users = require('./users')
const twitters = require('./twitters')
const admins = require('./admins')
const replyList = require('./replyList')



module.exports = (app) => {
  app.use('/', routes)
  app.use('/admins', admins)
  app.use('/users', users)
  app.use('/twitters', twitters)
  app.use('/replyList', replyList)
}