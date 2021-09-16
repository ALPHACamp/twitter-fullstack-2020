const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs'
})) 
app.set('view engine', 'hbs') 
app.use(express.static('public'))


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/tweets', (req, res) => {
  res.render('tweets')
})
app.get('/tweet', (req, res) => {
  res.render('tweet')
})
app.get('/followers', (req, res) => {
  res.render('follower')
})
app.get('/following', (req, res) => {
  res.render('following')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
