const express = require('express');
const handlebars = require('express-handlebars');

const helpers = require('./_helpers');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main.handlebars',
    //helpers: require('./config/handlebars-helpers'),
  })
);
app.set('view engine', 'handlebars');
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.use('/', routes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
