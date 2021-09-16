const users = require('./users')
const twitters = require('./twitters')
const admins = require('./admins')

module.exports = (app) => {
  app.use('/admins', admins)
  app.use('/users', users)
  app.use('/twitters', twitters)
}