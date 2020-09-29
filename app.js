const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))


app.engine('handlebars', handlebars({defaultLayout: 'main'})) 
app.set('view engine', 'handlebars') 

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('hello'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



// module.exports = app
require('./routes')(app)
