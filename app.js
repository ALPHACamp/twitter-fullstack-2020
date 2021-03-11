/* Config ENV */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

// Project packages
const expressHandlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');

const routes = require('./routes');
const helpers = require('./_helpers');

const usersController = require('./controllers/usersController');

const app = express();
const port = process.env.PORT;

app.engine('hbs', expressHandlebars({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebars-helpers') }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public/`));
app.use(methodOverride('_method'));
app.use(session({
  secret           : process.env.SESSION_SECRET,
  resave           : false,
  saveUninitialized: true,
}));
app.use(flash());
app.use('/upload', express.static(`${__dirname}/upload`));

app.use(passport.initialize());
app.use(passport.session());

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


const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});


http.listen(port, () => console.log(`===== Simple Twitter App starts listening on port ${port}! =====`));

module.exports = app;
