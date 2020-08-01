const express = require('express');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} 

const app = express();
const port = process.env.PORT || 3000
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


//iew engine
// app.use(express.static(__dirname + 'css'));
// app.use(express.static(__dirname + 'js'))
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

io.on('connection', (socket) => {
  //socket.on 使用者進入聊天室
  //socket.on 收到訊息
  // console.log(app)
  socket.on('user-online', () => {
    user = app.locals.user
    const newUser = {
      name: user.name,
      account: user.account,
      avatar: user.avatar
    }
    console.log(newUser)
    io.emit('user-online', newUser)
  })
  socket.on('chat_msg', (msg) => {
    user = app.locals.user
    msg.avatar = user.avatar
    msg.UserId = user.id
    msg.time = moment(msg.time).format('LLL')
    io.emit('chat_msg', msg)
  })
})
require('./routes')(app);

http.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
