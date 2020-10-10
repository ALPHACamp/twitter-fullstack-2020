const express = require('express')
const Handlebars = require('handlebars')
const helpers = require('./_helpers')
const exphbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const sessionMiddleware = session({
  secret: 'secret', 
  resave: false, 
  saveUninitialized: false
})

app.use(sessionMiddleware)
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next)
})

// run when a client connects
<<<<<<< HEAD
io.on('connection', (socket) => {

  const currentUser = socket.request.session
  console.log(currentUser)
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  // listen for chat message
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', { 
      msg,
      avatar: currentUser.avatar
    })
    console.log('message: ' + msg)
  })
})
=======
// io.on('connection', (socket) => {
//   console.log('a user connected')
//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })

//   // listen for chat message
//   socket.on('chatMessage', (msg) => {
//     io.emit('chatMessage', msg)
//     console.log('message: ' + msg)
//   })
// })
>>>>>>> master


server.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport, io)

module.exports = app
