let routes = require('./routes')
let apis = require('./apis')


module.exports = (app, passport) => {


  app.use('/', routes)
  app.use('/api', apis);

}
