const { User, Tweet, Reply } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => { // 登入
      return res.render('signup')
  },
  signInPage: (req, res) => { // 註冊
    return res.render('signin')
  },
  getUser: async(req, res) => { // 取得個人資料頁面(推文清單)
        let [users, user ] = await Promise.all([
            User.findAll({ where: { role: 'user' }, raw: true, nest: true, attributes: ['id'] }),
            User.findByPk((2) , {
                where: { role: 'user' },
                include: [
                    Tweet,
                    { model: Tweet, as: 'LikedTweets', include: [User] },
                ],
                order: [
                    ['Tweets', 'createdAt', 'DESC'],
                ],
            }),
        ])
        return res.render('users', {users: user.toJSON(),})
  },
  getSetting: (req, res, next) => { // 取得帳戶設定頁面
    return User.findOne({
      raw: true,
      nest: true,
      where: { id : "2" },
      attributes: ['name', 'email', 'account']
    })
    .then(user => {
      return res.render('setting', { user: user})
    })
    .catch(err =>next(err))
  },
  putSetting:(req, res, next) => { // 編輯帳戶設定
    const { name, email, account, password } = req.body

    return User.findOne({
      where: { id : "2" },
    })

    .then( user  => {
      return user.update({
        name, 
        email, 
        account, 
        password:bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
    })
    .then(() => {
        return res.redirect('setting')
      })
    .catch(err => next(err)) 
  },
  getFollower:(req,res,next)=>{ // 跟隨者
    res.render('follower')
  },
  getFollowing:(req,res,next)=>{ // 跟隨中
    res.render('following')
  },  
  logout: (req, res) => { // 登出
    res.redirect('/signin')
  }
}

module.exports = userController

