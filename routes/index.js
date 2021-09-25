const routes = require('./routes')
const users = require('./users')
const tweets = require('./tweets')
const admins = require('./admins')
const followships = require('./followships')
const api = require('./api')


module.exports = (app) => {
  app.use('/', routes)
  app.use('/admin', admins)
  app.use('/users', users)
  app.use('/tweets', tweets)
  app.use('/api', api)
  app.use('/followships', followships)
}