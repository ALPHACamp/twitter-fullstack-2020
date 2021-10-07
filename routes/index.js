const login = require('./login')
const admin = require('./admin')

module.exports = (app) => {
  app.use('/', login)
  app.use('/admin', admin)
}