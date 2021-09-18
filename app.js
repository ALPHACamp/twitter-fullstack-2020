const express = require("express");
port = process.env.PORT || 3000;

const handlebars = require("express-handlebars");
const helpers = require("./_helpers");
const db = require("./models");

const app = express();

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

require("./routes")(app);

module.exports = app;
