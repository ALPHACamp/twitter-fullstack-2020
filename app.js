const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./_helpers');
const session = require('express-session')
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const flash = require('connect-flash');



const app = express();
const port = 3000;

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())



// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()


// const db = require('./models')
// const User = db.User
// const bcrypt = require('bcryptjs')
// User.create({
//   account: 'good2@example.com',
//   password: bcrypt.hashSync("good2", bcrypt.genSaltSync(10)),
//   isAdmin: false
// })
// .then(() => {
//   console.log('success to create account')
// })
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  res.locals.successMessage = req.flash('successMessage')
  res.locals.errorMessage = req.flash('errorMessage')
  res.locals.userInput = req.flash('userInput')[0]
  next()
})

require('./routes/index')(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;