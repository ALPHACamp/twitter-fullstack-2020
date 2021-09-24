const helpers = require('./_helpers')
const express = require('express')
const app = express()
const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const axios = require('axios');
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: "*"}});


const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}



//變更順序以引入變數
const passport = require('./config/passport')


app.engine('hbs', exhbs({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers'), extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.get('/api/message', (req, res) => {
  return res.render('message')
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

server.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

// const routes = require('./routes')
// app.use(routes)



require('./routes')(app)



module.exports = app
