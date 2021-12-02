const express = require("express")
const handlebars = require("express-handlebars")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("./config/passport")

const app = express()
const port = 3000

app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
const helpers = require("./_helpers")
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")
  // use helpers.getUser(req) to replace req.user
  // use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
  //res.locals.user = helpers.getUser(req)
  next()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

require("./routes")(app, passport)

module.exports = app
