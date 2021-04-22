const express = require('express');
const handlebars = require('express-handlebars');
const { urlencoded } = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const helpers = require('./_helpers');
const routes = require('./routes');

const app = express();
const port = 3000;
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// body-parser
app.use(urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = helpers.getUser(req);
  next();
});

// get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

require('./routes')(app, passport);

module.exports = app;
