const bcrypt = require('bcryptjs')
const { Sequelize } = require('../models')
const { or } = Sequelize.Op
const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship

const userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          include: { model: User, as: 'LikedUser' },
        },
        { model: Tweet, include: Reply },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    })
      .then((user) => {
        const results = user.toJSON()
        results.followingCount = results.Followings.length
        results.followerCount = results.Followers.length

        for (let i = 0; i < results.Tweets.length; i++) {
          results.Tweets[i].repliesCount = results.Tweets[i].Replies.length
          results.Tweets[i].likeCount = results.Tweets[i].LikedUser.length
        }

        return res.json(results)
      })
      .catch((err) => res.send(err))
  },
  getUserLikeContent: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          as: 'LikedTweets',
          include: { model: User, as: 'LikedUser' },
        },
        {
          model: Tweet,
          as: 'LikedTweets',
          include: Reply,
        },
        {
          model: Tweet,
          as: 'LikedTweets',
          include: User,
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    })
      .then((user) => {
        user = user.toJSON()
        user.followingCount = user.Followings.length
        user.followerCount = user.Followers.length

        for (let i = 0; i < user.LikedTweets.length; i++) {
          user.LikedTweets[i].repliesCount =
            user.LikedTweets[i].LikedUser.length
          user.LikedTweets[i].likeCount = user.LikedTweets[i].Replies.length
        }

        res.json(user)
      })
      .catch((err) => res.send(err))
  },
  editUser: (req, res) => {
    if (Number(req.params.id) === Number(req._passport.session.user)) {
      return User.findByPk(req.params.id).then((user) => {
        user = user.toJSON()
        return res.json(user)
      })
    } else {
      req.flash(
        'error_message',
        "You don't have the authority to do this action"
      )
      return res.redirect('back')
    }
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', "name didn't exist")
      return res.redirect('back')
    }
    return User.findByPk(req.params.id).then((user) => {
      user
        .update({
          name: req.body.name,
          introduction: req.body.introduction,
        })
        .then((user) => {
          req.flash('success_message', 'user was successfully to update')
          res.json(user)
        })
    })
  },
  getUserFollowerList: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers' }, { model: Tweet }],
    }).then((user) => {
      const Followers = user.Followers.map((follower) => ({
        ...follower.dataValues,
        isFollowed: req.user.Followings.map((er) => er.id).includes(
          follower.id
        ),
      }))
      const results = {
        user: user,
        tweetCount: user.Tweets.length,
        Followers: Followers,
      }
      res.json(results)
    })
  },
  addFollowing: (req, res) => {
    const userId = req.params.userId
    return Followship.create({
      followerId: req.user.id,
      followingId: userId,
    })
      .then(() => res.redirect('back'))
      .catch((err) => res.send(err))
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: { followerId: req.user.id, followingId: req.params.userId },
    })
      .then((followship) => {
        followship.destroy().then(() => res.redirect('back'))
      })
      .catch((err) => res.send(err))
  },
  userSigninPage: (req, res) => {
    res.render('userSigninPage')
  },
  userSignupPage: (req, res) => {
    res.render('userSignupPage')
  },
  // 使用者進入passport前檢查關卡
  userCheckRequired: (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('error_messages', '請輸入帳號密碼！')
      return res.redirect('/signin')
    }
    return next()
  },
  // 使用者成功登入後訊息提示
  userSigninSuccess: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/tweets')
  },
  userSignup: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    // 必填檢查
    if (!account || !name || !email || !password || !checkPassword) {
      return res.render('userSignupPage', {
        account,
        name,
        email,
        error_messages: '別偷懶~全部欄位均為必填呦！',
      }) // 密碼因安全性問題，要重新填寫
    }
    // 密碼 & 確認密碼檢查
    if (password !== checkPassword) {
      return res.render('userSignupPage', {
        account,
        name,
        email,
        error_messages: '密碼與確認密碼不符，請重新確認！',
      })
    }
    // 檢查 account & email 是否為唯一值
    User.findOne({ where: { [or]: { account, email } }, raw: true })
      .then((user) => {
        if (!user) {
          return User.create({
            account,
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            avatar: 'https://image.flaticon.com/icons/svg/2948/2948062.svg',
            cover: 'https://unsplash.com/photos/mWRR1xj95hg',
            introduction: `Hi Guys,I'm ${name},nice to meet you!`,
            role: 'user',
          })
            .then(() => {
              req.flash('success_messages', '已成功註冊，請登入！')
              res.redirect('/signin')
            })
            .catch((err) => res.send(err))
        }
        if (user.account === account) {
          return res.render('userSignupPage', {
            account,
            name,
            email,
            error_messages: '帳號已存在，請更改成其他帳號！',
          })
        }
        if (user.email === email) {
          return res.render('userSignupPage', {
            account,
            name,
            email,
            error_messages: 'Email已存在，請更改成其他Email！',
          })
        }
      })
      .catch((err) => res.send(err))
  },
  accountSettingPage: (req, res) => {
    const { account, name, email } = helpers.getUser(req)
    res.render('accountSettingPage', { account, name, email })
  },
  accountSetting: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const { id } = helpers.getUser(req)
    // 檢查必填
    if (!account || !name || !email) {
      req.flash('error_messages', '請填寫必填項目:帳戶、名稱、E-mail')
      return res.redirect('/setting')
    }
    // 不更改密碼的情況
    if (!password && !checkPassword) {
      return updateAccount()
    }
    // 更改密碼，但缺其中一個
    if (!password || !checkPassword) {
      req.flash('error_messages', '欲更改密碼，請填入新密碼與確認新密碼！')
      return res.redirect('/setting')
    }
    // 密碼不相符
    if (password !== checkPassword) {
      req.flash('error_messages', '新密碼與確認新密碼不符，請重新確認！')
      return res.redirect('/setting')
    }
    return updateAccountAndPassword()

    function updateAccount() {
      User.findByPk(id)
        .then((user) =>
          user.update({
            account,
            name,
            email,
          })
        )
        .then(() => {
          req.flash('success_messages', '成功修改帳戶設定！')
          res.redirect('/setting')
        })
        .catch((err) => console.log(err))
    }
    function updateAccountAndPassword() {
      User.findByPk(id)
        .then((user) =>
          user.update({
            account,
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          })
        )
        .then(() => {
          req.flash('success_messages', '成功修改帳戶設定！')
          res.redirect('/setting')
        })
        .catch((err) => console.log(err))
    }
  },
  signout: (req, res) => {
    req.logout()
    req.flash('success_messages', '已成功登出！')
    res.redirect('/signin')
  },
}

module.exports = userController
