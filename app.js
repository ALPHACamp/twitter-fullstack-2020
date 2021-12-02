const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// 設定 view engine 使用 handlebars
app.engine(
	'hbs',
	handlebars({
		defaultLayout: 'main',
		extname: '.hbs',
	})
)

app.set('view engine', 'hbs')

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => res.render('signin'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
