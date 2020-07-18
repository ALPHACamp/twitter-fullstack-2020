const express = require('express');
const helpers = require('./_helpers');
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

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

//iew engine
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./config/handlebars-helper')
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
//flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

//app.get('/', (req, res) => res.send('Hello World!'));
require('./routes')(app);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
