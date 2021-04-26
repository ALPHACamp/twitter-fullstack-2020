const express = require('express');
const handlebars = require('express-handlebars');
const { urlencoded } = require('body-parser');
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const helpers = require('./_helpers');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(express.static(__dirname + '/public'));
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main.handlebars',
    //helpers: require('./config/handlebars-helpers'),
  })
);
app.set('view engine', 'handlebars');
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// body-parser
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
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

require('./routes')(app);

module.exports = app;
