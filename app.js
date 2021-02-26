/* Config ENV */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

// Project packages
const expressHandlebars = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const routes = require('./routes');
const helpers = require('./_helpers');

const app = express();
const port = process.env.PORT;

app.engine('hbs', expressHandlebars({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public/`));
app.use(methodOverride('_method'));

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(routes);

app.listen(port, () => console.log(`===== Simple Twitter App starts listening on port ${port}! =====`));

module.exports = app;
