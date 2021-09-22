const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

let routes = require('./routes');
let apis = require('./apis')

module.exports = (app) => {
  app.use('/', routes);
  app.use('/api', apis)
}