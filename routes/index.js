const sign = require('./modules/sign')
const apis = require('./modules/apis')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const chat = require('./modules/chat')
const followship = require('./modules/followship')
const admin = require('./modules/admin')

module.exports = app => {
  app.use('/', sign)
  app.use('/api', apis)
  app.use('/users', users)
  app.use('/tweets', tweets)
  app.use('/chat', chat)
  app.use('/followships', followship)
  app.use('/admin', admin)
}
