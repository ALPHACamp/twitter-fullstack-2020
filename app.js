const express = require('express')
const helpers = require('./_helpers');
const session = require('express-session');
const passport = require('./config/passport')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const methodOverride = require('method-override');
const flash = require('connect-flash');
const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine('hbs', handlebars({ extname: '.hbs', helpers: require('./config/handlebars-helper') }))
app.set('view engine', 'hbs')
app.use(methodOverride('_method'));
app.use(express.static('public'))
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req);
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req);
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  res.locals.successFlashMessage = req.flash('successFlashMessage');
  res.locals.errorFlashMessage = req.flash('errorFlashMessage');
  next();
});
app.use(routes)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
