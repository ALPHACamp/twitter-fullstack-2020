// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const handlebars = require('express-handlebars') 
const Handlebars = require('handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const helpers = require('./_helpers');
const app = express()
const port = process.env.PORT || 3000
const methodOverride = require('method-override')
const getTopTen = require('./helpers/getTopTen')
const { pages, apis } = require('./routes')



const SESSION_SECRET = 'secret'

Handlebars.registerHelper('raw', function (options) {
  return options.fn();
});

app.engine('hbs', handlebars({
  extname: '.hbs',
  partialsDir: ['views/partials', 'views/partials/svgs']
}));
app.set('view engine', 'hbs')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 啟動 session 功能
app.use(flash()) // 掛載套件
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))




app.use(async (req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')  // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages')  // 設定 warning_msg 訊息
  res.locals.currentUser = helpers.getUser(req)
  res.locals.topTenFollowed = await getTopTen(req)
  next();
});

app.use(apis)
app.use(pages)





app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app
