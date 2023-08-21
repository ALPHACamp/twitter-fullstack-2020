const express = require("express");
const handlebarsHelpers = require("./helpers/handlebars-helpers");
const handlebars = require("express-handlebars");
const session = require("express-session");
const routes = require("./routes");

const app = express();
const port = 3000;
const SESSION_SECRET = "secret";

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.set("view engine", "hbs");
app.engine("hbs", handlebars({ extname: ".hbs", helpers: handlebarsHelpers }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use("/", express.static("public"));

app.use(routes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
