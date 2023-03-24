const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => { // 登入
      return res.render('signup')
  },
  signInPage: (req, res) => { // 註冊
    return res.render('signin')
  },
  getUser: (req,res) => { // 取得個人資料頁面
    return res.render('users')
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
        password
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

