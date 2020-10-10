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
const { formatMessage } = require("./chat")
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

// get current user
let id, name, account, avatar;

app.use((req, res, next)=>{
  if(helpers.getUser(req)) ({id, name, account, avatar} = helpers.getUser(req))
  next()
})

let onlineUsers = []
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
//socket.io

const io = socket(server)

io.on('connection', socket => {
  //set up users
  onlineUsers.push({id, name, account, avatar});
  let set = new Set();
  onlineUsers = onlineUsers.filter(item => !set.has(item.id) ? set.add(item.id) : false);
  const user = onlineUsers.find(user => user.id === id);
  user.currentUser = true;
  socket.emit("message", `歡迎加入聊天室 ${user.name}`);
  socket.broadcast.emit("message", `${user.name} 加入聊天室`);

  socket.on("disconnect", ()=>{
    io.emit("message", `${user.name} 離開聊天室`)
  });
  // user get msg from input & send back
  socket.on("chatMessage", data=>{
    io.emit("chat", formatMessage(user.name, data, user.avatar, user.currentUser));
  })
})

// module.exports = app
require('./routes')(app, passport)