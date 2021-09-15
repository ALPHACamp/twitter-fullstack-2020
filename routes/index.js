const users = require('./users')

module.exports = (app, passport) => {
  app.use('/users', users)
}