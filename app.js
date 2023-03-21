const express = require('express')
<<<<<<< HEAD
const helpers = require('./_helpers')
const exphbs = require('express-handlebars')
=======
const handlebars = require('express-handlebars')
const routes = require('./routes')
const helpers = require('./_helpers')
>>>>>>> 1f5a677177aaee11ae9be3abef39cb2f04d640db

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(routes)

<<<<<<< HEAD
app.get('/', (req, res) => res.render('index'))
=======
>>>>>>> 1f5a677177aaee11ae9be3abef39cb2f04d640db
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
