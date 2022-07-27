"use strict";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require('express');

var helpers = require('./_helpers');

var methodOverride = require('method-override');

var handlebars = require('express-handlebars');

var handlebarsHelpers = require('./helpers/handlebars-helpers');

var session = require('express-session');

var passport = require('passport');

var flash = require('connect-flash');

var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();
var port = 3000;
var SESSION_SECRET = 'secret';
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: handlebarsHelpers
}));
app.set('view engine', 'hbs');
app.use(express.urlencoded({
  extended: true
}));
app.use(express["static"]('public'));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.error_messages_account = req.flash('error_messages_account');
  next();
}); // use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(routes);
app.listen(port, function () {
  return console.log("Example app listening on port ".concat(port, "!"));
});
module.exports = app;