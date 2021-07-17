const express = require('express')
const hbs = require('express-handlebars')
const db = require('./models')
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const PORT = process.env.PORT || 8000

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

//set .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// set public file
app.use(express.static('public'))
// set handlebars
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

//for mocha test's
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

require('./routes')(app)

// socket.io

io.on('connection', (socket) => {
  console.log('user connected')
  socket.on('custom-event', (number, string, obj) => {
    console.log(number, string, obj)
  })
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', (obj) => {
    console.log('user disconnected...obj', obj);
    io.emit('chat message', `someone left`)
  });
});

server.listen(3000, () => {
  console.log('socket listening on port 3000')
})


module.exports = app
