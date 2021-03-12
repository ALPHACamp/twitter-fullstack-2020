/* Config ENV */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const app = express();
const port = process.env.PORT;
// Project packages
const expressHandlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const passport = require('./config/passport');

const routes = require('./routes');
const helpers = require('./_helpers');

const usersController = require('./controllers/usersController');
const { type } = require('os');

app.engine('hbs', expressHandlebars({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebars-helpers') }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public/`));
app.use(methodOverride('_method'));
const sessionMiddleware = session({
  secret           : process.env.SESSION_SECRET,
  resave           : false,
  saveUninitialized: true,
});
app.use(sessionMiddleware);
app.use(flash());
app.use('/upload', express.static(`${__dirname}/upload`));

app.use(passport.initialize());
app.use(passport.session());

// Link passport login to socket.io connection, then use middleware to assign user
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
});

const onlineUsers = [];

io.on('connect', (socket) => {
  // Link session with socket ID to make it persistent
  const { session } = socket.request;
  session.socketId = socket.id;
  session.save();

  onlineUsers.push(socket.request.user);
  // console.log(`new connection ${socket.id}`);
  // console.log('60 socket.request.user', socket.request.user);
  // socket.on('whoami', (cb) => {
  //   cb(socket.request.user ? socket.request.user.username : '');
  // });

  // 對所有線上用戶的通知 新使用者上線
  socket.broadcast.emit('joined', {
    name   : socket.request.user.name,
    account: socket.request.user.account,
    avatar : socket.request.user.avatar,
  });
  // 同時在線使用者
  socket.emit('userJoined', onlineUsers);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log(`chat message:${msg}`);
  });
  // message broadcasting
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.me = helpers.getUser(req);

  // Only getTopFollowing if logged in
  if (res.locals.me !== undefined && !req.originalUrl.includes('/logout')) {
    usersController.getTopFollowing(req)
    .then((users) => {
      res.locals.topFollowingsUsers = users;
    });
  }

  next();
});

app.use(routes);

http.listen(port, () => console.log(`===== Simple Twitter App starts listening on port ${port}! =====`));

module.exports = app;
