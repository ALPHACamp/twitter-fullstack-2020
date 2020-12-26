const express = require('express')
const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const helpers = require('./_helpers')
const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const session = require('express-session')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000
const sessionMiddleware = session({ secret: 'simpleTweetSecret', resave: false, saveUninitialized: false })

//socket
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const activeUsers = new Set()

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});
const db = require('./models')
const Tweet = db.Tweet
io.on('connection', (socket) => {
  console.log(`new connection ${socket.id}`)
  console.log(socket.request.user)
  socket.broadcast.emit("hello", socket.request.user.name)
  const activeUsers = new Set()
  activeUsers.add(socket.request.user.name)
  console.log(activeUsers)
  io.emit('new user', [...activeUsers])
  // socket.on('new user', (data) => {
  //   console.log(data)
  //   socket.userId = data
  //   activeUsers.add(data)
  //   io.emit('new user', [...activeUsers])
  // })

  socket.on('chat message', (data) => {
    data.user = socket.request.user
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} is disconnected`)
    io.emit('user disconnected', socket.id)
  })
});

server.listen(3000);

app.use(express.static('public'))
app.engine('hbs', exhbs({ defaultLayout: 'main', extname: 'hbs', helpers: require('./config/handlebars-helper') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user
  next()
})

app.use('/upload', express.static(__dirname + '/upload'))

app.get('/chat', (req, res) => {
  const isAuthenticated = !!req.user;
  if (isAuthenticated) {
    console.log(`user is authenticated, session is ${req.session.id}`);
    return res.sendFile(__dirname + '/index.html');
  } else {
    console.log("unknown user");
    return res.redirect('/signin')
  }
})


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))


app.use(routes)

module.exports = app