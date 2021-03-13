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
const { type } = require('os');
const moment = require('moment');
const passport = require('./config/passport');

const routes = require('./routes');
const helpers = require('./_helpers');

const usersController = require('./controllers/usersController');

moment.locale('zh-TW');
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

const db = require('./models');

const { Message } = db;

io.on('connection', (socket) => {
  // Link session with socket ID to make it persistent
  const { session } = socket.request;
  session.socketId = socket.id;
  session.save();

  // 當使用者本人登入，將userId 傳送到前端
  socket.emit('me', socket.request.user.id);

  // 監聽前端的 join 要求，會傳入 room 名稱
  socket.on('join', (room) => {
    // Remove the rooms joined that's not the current one
    socket.rooms.forEach((joinedRoom) => {
      if (joinedRoom !== socket.id && joinedRoom !== room) {
        socket.leave(joinedRoom);
      }
    });
    socket.join(room);

    // get room list
    const { rooms } = io.of('/').adapter;
    const socketsInRoom = rooms.get(room);

    // get users in the room
    const usersInRoom = [];
    socketsInRoom.forEach((socketId) => {
      usersInRoom.push(io.of('/').sockets.get(socketId).request.user);
    });

    // return to frontend
    io.to(room).emit('userJoined', { user: socket.request.user, usersInRoom });
  });

  // 用戶離開，傳用戶資訊到他原本在的 room 來通知誰離線，重新抓房間線上使用者資料
  socket.on('disconnecting', () => {
    const { rooms } = io.of('/').adapter;

    // 取得目前所有房間，準備傳離線訊息到所有房間
    socket.rooms.forEach((room) => {
      const socketsInRoom = rooms.get(room);
      const usersInRoom = [];
      // 每一個房間內的除了自己以外所有使用者
      socketsInRoom.forEach((socketId) => {
        const socketUser = io.of('/').sockets.get(socketId).request.user;
        if (socketUser.id !== socket.request.user.id) {
          usersInRoom.push(socketUser);
        }
      });
      // return to frontend
      io.to(room).emit('userLeft', { user: socket.request.user, usersInRoom });
    });
  });

  // 測試用 disconnecting 和 disconnect 差別
  socket.on('disconnect', () => {
    // user left delete user
    socket.leave('/');
    // socket.rooms.size === 0
    console.log('user', socket.request.user.id);
    console.log('disconnect rooms', socket.rooms);
  });

  socket.on('sendMessage', (payload) => {
    // Expect payload { identifier: 'public / somethingForPrivate', message: 'message sent' }
    if (payload.identifier === 'public') {
      // Create message record
      Message.create({
        senderId: socket.request.user.id,
        message : payload.message,
        isPublic: true,
      })
      .then((message) => {
        // When newMessage come in, emit notify the room with sender, and his/her message
        io.to(payload.identifier).emit('newMessage', {
          sender   : socket.request.user,
          message  : message.dataValues.message,
          createdAt: `${moment(message.dataValues.createdAt).format('a h:mm')}`,
        });
      })
      .catch((err) => console.error(err));
    }
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

// Make io available to router/controller
app.io = io;

http.listen(port, () => console.log(`===== Simple Twitter App starts listening on port ${port}! =====`));

module.exports = app;
