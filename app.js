if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const helpers = require('./_helpers');
const routes = require('./routes')

const app = express()
const port = 3000

app.engine('hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))


app.get('/', (req, res) => res.send('Hello World!'))
// app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
