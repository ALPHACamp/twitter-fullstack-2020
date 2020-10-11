const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const db = require('./models')
const Message = db.Message;
const User = db.User;
const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const socket = require('socket.io')
const { formatMessage } = require("./chat")
const moment = require('moment');
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

io.on('connection', async socket => {
  //set up users
  onlineUsers.push({id, name, account, avatar});
  let set = new Set();
  onlineUsers = onlineUsers.filter(item => !set.has(item.id) ? set.add(item.id) : false);
  const user = onlineUsers.find(user => user.id === id);
  user.currentUser = true;

  // history message
  let historyMessages;
  await Message.findAll({
    include: [User],
    order: [['createdAt', 'ASC']]
  }).then(data=>{
    historyMessages = data.map(item=>({
      message: item.dataValues.message,
      name: item.dataValues.User.name,
      avatar: item.dataValues.User.avatar,
      currentUser: user.id === item.dataValues.User.id ? true : false,
      time: moment(item.dataValues.createdAt).format('LT')
    }))
  })
  socket.emit("history", historyMessages);

  socket.on('typing', data => {
    data.name = user.name
    socket.broadcast.emit('typing', data)
  })

  socket.emit("message", `歡迎加入聊天室 ${user.name}`);
  socket.broadcast.emit("message", `${user.name} 加入聊天室`);


  io.emit('onlineUsers', onlineUsers);
  
  socket.on("disconnect", ()=>{
    onlineUsers = onlineUsers.filter(user => user.id !== id)
    io.emit('onlineUsers', onlineUsers)
    io.emit("message", `${user.name} 離開聊天室`)
  });
  // user get msg from input & send back
  socket.on("chatMessage", data=>{
    console.log(data);
    Message.create({
      message: data,
      UserId: user.id
    });
    io.emit("chat", formatMessage(user.name, data, user.avatar, user.currentUser));
  })
  //Private Message
  socket.on('privateMessage', data => {
    const senderId = Number(user.id)
    const receiverId = data.receiverId;
  })
})

// module.exports = app
require('./routes')(app, passport)