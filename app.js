const express = require('express')

const handlebars = require('express-handlebars')
const helpers = require('./_helpers');
<<<<<<< HEAD
const exphbs = require("express-handlebars");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;
=======
const db = require('./models')

>>>>>>> 38e79beb3449262431f76ce39965443dad3ac612
const app = express()


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
<<<<<<< HEAD
if (process.env.NODE_ENV === "test") {
  app.use((req, res, next) => {
    req.user = helpers.getUser(req);
    next();
  });
}

//handlebar engine
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: require("./config/handlebars-helpers"),
  })
);
app.set("view engine", "hbs");

//folder paths
const path = require("path");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/upload", express.static(__dirname + "/upload"));

const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.warning_messages = req.flash("warning_messages");
  res.locals.currentuser = req.user;
  next();
});

//set method-override
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

require("./routes/route.js")(app);
=======
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

>>>>>>> 38e79beb3449262431f76ce39965443dad3ac612
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
