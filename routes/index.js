const db = require('../models')
const { User, Tweet, Reply, Like } = db


const routes = require('./routes')
// let apis = require('./apis')

module.exports = (app) => {
  app.use('/', routes)
  // app.use('/api', apis)
}
