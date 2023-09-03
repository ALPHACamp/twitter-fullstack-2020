const customError = require('./custom-error')
const helpers = require('../../_helpers')

const errorHandler = (err, req, res, next) => {
  let errorMessage = ''
  switch (err.constructor) { // 用constructor來區分不同的錯誤
    // 可以複製 JWTTokenError的格式，自行增加需要使用的error type
    case customError.LocalStrategyError:
      errorMessage = `Passport local strategy login Related Error: ${err.message}`
      break
    case customError.CustomError:
      errorMessage = `${err.name}: ${err.message}`
      break
    case RangeError:
      errorMessage = `${err.name}: ${err.message}`
      break
    default:
      errorMessage = `Non Error Class Error: ${err.message}`
      break
  }

  const redirectTo = helpers.getUser(req)?.role === 'admin' ? '/admin/signin' : '/signin'
  const referer = req.get('Referer') || redirectTo // 避免上一頁沒有東西

  req.flash('error_messages', errorMessage)
  res.redirect(referer) // 回到上一頁

  return next(err) // 預留，以後可以記log用
}

module.exports = errorHandler