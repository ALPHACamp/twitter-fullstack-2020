const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const socket = require('socket.io')
require("dotenv").config();

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.json())


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})


app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.render('signin'))


const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
//socket.io

const io = socket(server)

let onlineUsers = []

io.on('connection', socket => {
  
  socket.emit("message", "welcome to chatcord");

  socket.broadcast.emit("message", "a user has join chat");

  socket.on("disconnect", ()=>{
    io.emit("message", "a user has left chat")
  })
})

// module.exports = app
require('./routes')(app, passport)