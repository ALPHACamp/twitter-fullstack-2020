const routes = require('./modules/routes')
const apis = require('./modules/apis')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const chat = require('./modules/chat')
const followship = require('./modules/followship')

module.exports = app => {
  app.use('/', routes)
  app.use('/api', apis)
  app.use('/users', users)
  app.use('/tweets', tweets)
  app.use('/followships', followship)
  app.use('/chat', chat)
}
