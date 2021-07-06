const express = require('express')
const exphbs = require('express-handlebars')
const helpers = require('./_helpers')
// const flash = require('connect-flash')

const app = express()
const port = 3000

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helper')
}))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// app.use(flash())
// app.use((req, res, next) => {
//   res.locals.top_following = req.flash('top_following')
//   next()
// })


require('./routes/index')(app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app
