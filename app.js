const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers');

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => {
  console.log('1234')
  res.send('Hello World!')
}

)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//require('./routes')(app)

module.exports = app
