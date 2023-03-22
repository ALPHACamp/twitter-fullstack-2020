// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000

// should be deleted after//
const { User, Tweet } = require('./models')



// should be deleted after//


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine('hbs', handlebars({
  extname: '.hbs',
  partialsDir: ['views/partials', 'views/partials/svgs']
}));
app.set('view engine', 'hbs')
app.use(express.static('public'));









app.get('/', async (req, res) => {
  const tweet = await User.findByPk(1, {
    include: [
      { model: User, as: 'Followings', include:[Tweet] }
      


    ]
  })
  console.log(tweet.toJSON())
  res.render('home', { tweet: tweet.toJSON() })


})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
