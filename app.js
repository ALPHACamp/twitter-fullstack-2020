if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const PORT = process.env.PORT || 3000

const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const path = require('path')
const Handlebars = require('handlebars')
const helpers = require('./_helpers')
const socket = require('socket.io')

// This package can help you disable prototype checks for your models.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

app.use(express.static('public'))

app.use('/upload', express.static(__dirname + '/upload'))


app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: require('./config/handlebars-helpers'),  // add partial
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  // console.log(req.user)
  next()
})


const server = app.listen(PORT, () => console.log(`Express is listening on http://localhost:${PORT}`))
const io = socket(server)

io.on('connection', socket => {
  console.log('a user connected!');

  socket.on('message', data => {
    console.log('Get message')
    // socket.broadcast.emit('chat', 'A join chat room')
    io.emit("chat", 'A join chat room');
  })

  socket.on('disconnect', function () {
    console.log('a user go out');
  })
})


require('./routes')(app, passport)

module.exports = app