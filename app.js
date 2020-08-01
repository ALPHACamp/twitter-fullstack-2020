const express = require('express');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} 

const app = express();
const port = 3000;
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const helpers = require('./_helpers')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const moment = require('moment')
const db = require('./models')
const ChatMessage = db.ChatMessage



app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./config/handlebars-helpers')
  })
);
app.set('view engine', 'hbs');
// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//method override
app.use(methodOverride('_method'));
// session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.static('public'));
//flash
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  // res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = helpers.getUser(req)
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  app.locals.user = helpers.getUser(req)
  next();
});


const users = []
const chatMessage = []
let usersCount = 0

io.on('connection', (socket) => {
  //socket.on 使用者進入聊天室
  //socket.on 收到訊息
  socket.on('user-online', (user) => {
    user.socketId = socket.id
    if (!users.map(i => i.UserId).includes(user.UserId)){
      users.push(user)
    }
    usersCount = users.length
    io.emit('user-online', user)
    io.emit('renderUser', users)
    io.emit('userCount', usersCount)
  })
  socket.on('chat_msg', (msg) => {
    const { UserId, time, message } = msg
    ChatMessage.create({
      UserId, time, message
    })
    msg.time = moment(msg.time).tz("Asia/Taipei").format('LLLL')
    chatMessage.push(msg)
    io.emit('renderMsg', msg)
  })
})
require('./routes')(app);

http.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
