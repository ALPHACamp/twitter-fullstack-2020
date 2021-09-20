const express = require('express');
const helpers = require('./_helpers');

/* if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} */

const app = express();
const port = 3000;
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

//iew engine
app.use(express.static(__dirname + 'css'));
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
//passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
//flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.myUser = helpers.getUser(req);
  next();
});
require('./routes')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
