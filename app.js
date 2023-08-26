if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const handlebarsHelpers = require("./helpers/handlebars-helpers");
const handlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const routes = require("./routes");
const helpers = require("./_helpers");
const path = require("path");
const methodOverride = require("method-override");
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
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.use("/upload", express.static(path.join(__dirname, "upload"))); //上傳圖片
app.use("/", express.static("public"));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.warning_messages = req.flash("warning_messages");
  res.locals.info_messages = req.flash("info_messages");
  res.locals.account_messages = req.flash("account_messages");
  res.locals.user = helpers.getUser(req);
  res.locals.paramsUser = req.params.user;
  next();
});

app.use(routes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
