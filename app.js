const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const app = express()
const axios = require('axios')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('./models') // 引入資料庫
const port = process.env.PORT || 3000

const passport = require('./config/passport')

app.use(cors())

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: require('./utils/hbsHelpers') })) // Handlebars 註冊樣板引擎
app.set('view engine', 'hbs') // 設定使用 Handlebars 做為樣板引擎
app.use(express.static('public'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

let userinfo = null
// flash words in global
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  userinfo = req.user
  next()
})

require('./routes')(app)
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = require('socket.io')(server)
const { Message, User } = db

io.on('connection', (socket) => {
  socket.on('open', (msg) => {
    console.log('user connected')
    if (userinfo) {
      socket.UserId = userinfo.id
      User.findAll({
        where: { login: true }
      })
        .then(users => {
          console.log("users.length=", users.length)
          io.emit('update_loginUsers', users);
        })
    }
  })
  socket.on('chat message', (msg) => {
    Message.create({
      type: msg.type,
      body: msg.body,
      FromId: Number(msg.fromId),
      ToId: Number(msg.toId)
    })
    io.emit('chat message', msg);

    // if (Number(msg.toId) !== 0) {
    //   const names = [msg.fromId, msg.toId].sort()
    //   const roomName = names[0] + names[1]
    //   io.emit("get_room", roomName, msg);
    // }
  });

  socket.on('push_to_other', (obj) => {
    const fromId = Number(obj.fromId) //A
    const toId = Number(obj.toId) //B
    Message.findAll({
      where: { type: "0", ToId: toId }
    })
      .then(messages => {
        User.findAll()
          .then(users => {
            let msgs = []
            for (let user of users) {
              let msg = messages.filter(message => message.FromId === user.dataValues.id)
              if (Number(fromId) === Number(user.dataValues.id)) {
                msg = [{
                  dataValues: {
                    type: obj.type,
                    body: obj.body,
                    FromId: Number(obj.fromId),
                    ToId: Number(obj.toId),
                    createAt: new Date(),
                    updatedAt: new Date()
                  }
                }]
              }

              if (msg.length > 1) {
                msg = msg.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)[0].dataValues
              } else {
                if (msg[0]) {
                  msg = msg[0].dataValues
                } else {
                  msg = msg[0]
                }
              }
              if (msg) {
                msg.id_From_ToId = user.dataValues.id
                msg.avatar_From_ToId = user.dataValues.avatar
                msg.name_From_ToId = user.dataValues.name
                msg.account_From_ToId = user.dataValues.account
                msgs.push(msg)
              }
            }
            msgs = msgs.sort((a, b) => a.dataValues.updatedAt - b.dataValues.updatedAt)
            io.emit('push_to_other', obj, msgs);
          })
      })


    // io.emit('push_to_other', msg, roomName);

  })


  socket.on('disconnect', function () {
    console.log('user disconnected');
    if (!userinfo && socket['UserId']) {
      User.findByPk(socket['UserId'])
        .then(user => {
          user.update({
            login: false
          })
        })
    }
  });
});


module.exports = app
