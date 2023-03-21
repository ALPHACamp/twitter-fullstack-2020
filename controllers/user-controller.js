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
  getSetting: (req, res) => { // 取得個人帳戶設定頁面
    return res.render('setting')
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