// 這段重複的部份很多，需要之後來優化@@
const jwt = require('jsonwebtoken')

const passport = require('../config/passport')
const helpers = require('../_helpers')
const errors = require('../helpers/errors-helpers')
const { isSigninPage } = require('../helpers/signin-helpers')

// adminLocalAuth 與 userLocalAuth是提供給第一次login使用的
const adminJWTAuth = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next() // 測試檔使用
  const middleware = passport.authenticate('jwt', { session: false }, function callback (error, user) { // 這個function會被傳入passport的jwt strategy
    if (error || !user) {
      if (isSigninPage(req)) return next() // path 不會加/admin
      return res.redirect('/admin/signin')
    }
    if (user.role !== 'admin' && !isSigninPage(req)) {
      // 亂登入就刪你cookie(避免signin時發現已登入過直接跳轉的問題)
      res.cookie('jwtToken', '', { expires: new Date(0) })
      return next(new errors.JWTStrategyError('只有管理員可以訪問此區域。'))
    }
    req.user = user
    res.locals.layout = 'admin-layout'// 指定admin要使用admin-layout.handlebars
    next()
  })
  middleware(req, res, next)
}

const userJWTAuth = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next() // 測試檔使用
  const middleware = passport.authenticate('jwt', { session: false }, function callback (error, user) { // 這個function會被傳入passport的jwt strategy
    if (error || !user) {
      if (isSigninPage(req)) return next()
      return res.redirect('/signin')
    }
    if (user.role === 'admin' && !isSigninPage(req)) {
      // 亂登入就刪你cookie(避免signin時發現已登入過直接跳轉的問題)
      res.cookie('jwtToken', '', { expires: new Date(0) })
      return next(new errors.LocalStrategyError('管理員不能訪問此區域。'))
    }
    req.user = user
    res.locals.layout = 'user-layout' // 指定user要使用user-layout.handlebars
    next()
  })
  middleware(req, res, next)
}

// login成功後由此簽發
const JWT_DURATION_HOURS = 24
const sendToken = (req, res, next) => {
  try {
    const userData = helpers.getUser(req).toJSON() // 關閉session後直接從localstrategy得到user，是直接從sequelize中撈出來的
    delete userData.password
    const token = jwt.sign(userData, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: `${JWT_DURATION_HOURS}h` }) // 簽發jwt
    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: false, // 如果使用 HTTPS，請取消註釋此行
      maxAge: JWT_DURATION_HOURS * 60 * 60 * 1000 // 設置 cookie 的有效期，例如24小時
    })
    next()
  } catch (error) {
    return next(error)
  }
}

module.exports = { sendToken, adminJWTAuth, userJWTAuth }
