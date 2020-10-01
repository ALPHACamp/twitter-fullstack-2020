const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./_helpers');
const session = require('express-session');
const passport = require('./config/passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000;

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req);
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req);
  next();
});
// app.use('/', (req, res) => {
//   res.render('admin/users');
// });
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

require('./routes/index')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
