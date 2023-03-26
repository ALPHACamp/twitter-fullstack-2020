// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars') 
const helpers = require('./_helpers');
const routes = require('./routes')
const app = express()

const port =  process.env.PORT || 3000
// const db = require('./models')
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

module.exports = app
