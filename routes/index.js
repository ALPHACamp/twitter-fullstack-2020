const routes = require('./routes.js')

module.exports = app => {
  app.use('/', routes)
}