 // TODO controller
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/home')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserProfile:(req, res)=>{
    return res.render('userProfile')
  },
  getSetting:(req, res)=>{
    return res.render('setting')
  },
  putUser: async (req,res) =>{
    console.log('到putUser了')
    const user = await User.findByPk(req.params.id)
    
    user.update({
        acount:req.body.acount,
        name:req.body.name,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
    })
     req.flash('success_messages', 'user was successfully to update')
     res.redirect(`/home`)
  },

  getUserTweets: (req, res) => {
    const id = req.params.id
    const loginUserId = helper.getUser(req).id
    const whereQuery = {}

    // 類似餐廳與類別的關係
    // 多個餐廳屬於一種類別: 多個推文屬於一個使用者
    if (req.query.tweetId) {
      tweetId = Number(req.query.userId)
      whereQuery.userId = tweetId
    }

    // 顯示個人資料及推文
    Tweet.findAndCountAll({
      raw: true,
      nest: true,
      where: { UserId: id }
    })
      .then((result) => {
        const data = result.rows.map(r => ({
          ...r.dataValues
        }))
        User.findByPk(id)
          .then((user) => {
            const userProfile = user.toJSON()
            return res.render('user', {
              data,
              tweets: data,
              userProfile,
              loginUserId,
              replyNum,
            })
          }).catch(err => console.log(err))
      }).catch(err => console.log(err))
  },
  
  // 尋找回覆過且正在追隨的使用者推文
  // 不需要認證使用者
  getReplyTweets: (req, res) => {
    const id = req.params.id
    const whereQuery = {}

    if (req.query.tweetId) {
      tweetId = Number(req.query.userId)
      whereQuery.userId = tweetId
    }

    // 顯示回覆過的推文
    Reply.findAll({
      include: tweet,
      where: { UserId: id }
    })
      .then((result) => {
        // 回覆過的推文數量
        const replyNum = result.count
        const replyTweets = result.rows
        const data = replyTweets.map(r => ({
          ...r.dataValues
        }))

        tweet.findAll({
          raw: true,
          nest: true,
          where: whereQuery
        }).then(() => {
          User.findByPk(id)
            .then((user) => {
              const userProfile = user.toJSON()
              return res.render('user', {
                data,
                tweets: data,
                userProfile,
                loginUserId,
                replyNum,
              })
            }).catch(err => console.log(err))
        })

      // TODO 2.顯示喜歡的內容
    
      })
      .catch(err => console.log(err))
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController
