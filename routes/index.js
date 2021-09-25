const routes = require('./routes')
const users = require('./users')
const tweets = require('./tweets')
const admins = require('./admins')



module.exports = (app) => {
  app.use('/', routes)
  app.use('/admin', admins)
  app.use('/users', users)
  app.use('/tweets', tweets)
}