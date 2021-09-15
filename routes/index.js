const users = require('./users')
const twitters = require('./twitters')

module.exports = (app, passport) => {
  app.use('/users', users)
  app.use('/twitters', twitters)
}