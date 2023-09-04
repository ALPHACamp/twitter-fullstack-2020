const passport = require('../config/passport')
const helpers = require('../_helpers')

const userLocalAuth = (req, res, next) => {
  const middleware = passport.authenticate('local',
    { },
    function (error, user) {
      if (error) {
        return next(error)
      }

      if (!user) {
        return res.redirect('/signin')
      }

      if (user.role === 'admin') {
        req.flash('error_messages', '管理員不能訪問此區域')
        const referer = req.get('Referer') || '/admin/signin'
        return res.redirect(referer) // 傳回上一頁
      }

      // activate passport.sequrlizeUser
      req.login(user, function (err) {
        if (err) {
          return next(err)
        }
        return next()
      })
    })
  middleware(req, res, next)
}

const adminLocalAuth = (req, res, next) => {
  const middleware = passport.authenticate('local',
    { },
    function (error, user) {
      if (error) {
        return next(error)
      }

      if (!user) {
        return res.redirect('/admin/signin')
      }

      if (user.role !== 'admin') {
        req.flash('error_messages', '只有管理員可以訪問此區域')
        const referer = req.get('Referer') || '/signin'
        return res.redirect(referer) // 傳回上一頁
      }

      // activate passport.sequrlizeUser
      req.login(user, function (err) {
        if (err) {
          return next(err)
        }

        return next()
      })
    })
  middleware(req, res, next)
}
const authenticatedUser = (req, res, next) => {
  try {
    if (helpers.ensureAuthenticated(req)) {
      const user = helpers.getUser(req)

      if (user.role !== 'admin') {
        res.locals.layout = 'user-layout' // 指定user要使用user-layout.handlebars
        res.locals.user = user // 在本地端也放入user參數方便模板使用

        return next()
      } else {
        const referer = req.get('Referer') || '/admin/tweets' // 取得上一頁是從哪裡來

        req.flash('error_messages', '管理員不能訪問此區域')

        return res.redirect(referer) // 傳回上一頁
      }
    } else {
      return res.redirect('/signin')
    }
  } catch (error) {
    next(error)
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    const user = helpers.getUser(req)

    if (user.role === 'admin') {
      res.locals.layout = 'admin-layout'// 指定admin要使用admin-layout.handlebars
      res.locals.user = user // 在本地端也放入user參數方便模板使用

      return next()
    } else {
      const referer = req.get('Referer') || '/tweets' // 取得上一頁是從哪裡來

      req.flash('error_messages', '只有管理員可以訪問此區域')

      return res.redirect(referer) // 傳回上一頁
    }
  } else {
    return res.redirect('/admin/signin')
  }
}

module.exports = {
  userLocalAuth,
  adminLocalAuth,
  authenticatedAdmin,
  authenticatedUser
}
