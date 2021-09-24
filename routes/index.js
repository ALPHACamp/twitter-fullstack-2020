const routes = require('./modules/routes')
const apis = require('./modules/apis')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

module.exports = app => {
  app.use('/', routes)
  app.use('/api', apis)
  app.use('/users', users)
  app.use('/tweets', tweets)
}
