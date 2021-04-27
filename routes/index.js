const apis = require('./apis')
const routes = require('./routes')

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', apis)
}