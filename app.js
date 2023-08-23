const express = require('express')
const routes = require('./routes')

const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(routes)


app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
