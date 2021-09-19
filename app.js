const express = require("express");
port = process.env.PORT || 3000;
host = process.env.BASE_URL || "http://localhost";

const handlebars = require("express-handlebars");
const helpers = require("./_helpers");
const db = require("./models");

const app = express();

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine(".hbs", handlebars({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");

app.use(express.static("public"));

app.listen(port, () => console.log(`Example app listening at ${host}:${port}`));

require("./routes")(app);

module.exports = app;
