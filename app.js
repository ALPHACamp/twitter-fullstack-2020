const express = require("express");
port = process.env.PORT || 3000;
host = process.env.BASE_URL || "http://localhost";

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars')
const handlebars = require("express-handlebars");
const helpers = require("./_helpers");
const db = require("./models");

const app = express();

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine(".hbs", handlebars({ extname: ".hbs", defaultLayout: "main", helpers: require('./config/handlebars-helpers'), handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set("view engine", ".hbs");

app.use(express.static("public"));
const routes = require("./routes");
app.use(routes);
app.listen(port, () =>
  console.log(`simple-twitter app listening at ${host}:${port}`)
);

module.exports = app;
