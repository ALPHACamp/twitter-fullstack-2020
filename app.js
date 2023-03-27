// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const methodOverride = require('method-override')
const getUser = require('./helpers/getUser')
const getTopTen = require('./helpers/getTopTen')
const { pages, apis } = require('./routes')



// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(getUser)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(async (req, res, next) => {
  res.locals.user = await helpers.getUser(req)
  res.locals.topTenFollowed = await getTopTen(req)
  next();
});

app.use(apis)
app.use(pages)



app.engine('hbs', handlebars({
  extname: '.hbs',
  partialsDir: ['views/partials', 'views/partials/svgs']
}));


app.set('view engine', 'hbs')

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app
