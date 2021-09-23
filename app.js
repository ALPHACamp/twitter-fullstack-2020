const express = require("express");
port = process.env.PORT || 3000;
host = process.env.BASE_URL || "http://localhost";
const session = require("express-session");
const db = require("./models");
const methodOverride = require("method-override");
const usePassport = require('./config/passport')
const routes = require("./routes");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const handlebars = require("express-handlebars");
const helpers = require("./_helpers");

const app = express();

// 設定在測試環境下使用 helpers.getUser(req) 作為 req.user
if (process.env.NODE_ENV === "test") {
  app.use((req, res, next) => {
    req.user = helpers.getUser(req);
    next();
  });
}

// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine(".hbs", handlebars({ extname: ".hbs", defaultLayout: "main", helpers: require('./config/handlebars-helpers'), handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
usePassport(app)
// app.use((req, res, next) => {
//   res.locals.user = helpers.getUser(req)
//   next()
// })

app.use(routes);
app.listen(port, () =>
  console.log(`simple-twitter app listening at ${host}:${port}`)
);

module.exports = app;
