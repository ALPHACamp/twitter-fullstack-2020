const express = require('express')
const helpers = require('./_helpers');

const app = express()
const port = 3000

const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')


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

app.get('/user/self', (req, res) => {
  res.render('user')
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// module.exports = app
