const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000

const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const passport = require('passport')


app.engine('hbs', exhbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => {
  console.log('Hello,Hello,Hello')
  res.send('Hello World!')

})


app.get('/tweets/replies', (req, res) => {
  res.render('replyUser')
})
app.get('/admin/users', (req, res) => {
  res.render('userAdmin')
})
app.get('/admin/tweets', (req, res) => {
  res.render('admin/tweetsAdmin')
})

require('./routes')(app, passport)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
