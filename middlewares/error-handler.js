const errors = require('../helpers/errors-helpers')

const errorHandler = (err, req, res, next) => {
  let errorMessage = ''
  switch (err.constructor) { // 用constructor來區分不同的錯誤
    // 可以複製 JWTTokenError的格式，自行增加需要使用的error type
    case errors.JWTTokenError:
      errorMessage = `JWT Token Related Error: ${err.message}`
      break
    case errors.JWTStrategyError:
      errorMessage = `Passport JWT strategy login  Related Error: ${err.message}`
      break
    case errors.LocalStrategyError:
      errorMessage = `Passport local strategy login Related Error: ${err.message}`
      break
    case errors.FollowshipError:
      errorMessage = `Followship Error: ${err.message}`
      break
    default:
      errorMessage = `Non Error Class Error: ${err.message}`
      break
  }

  req.flash('error_messages', errorMessage)
  res.redirect('back') // 回到上一頁

  return next(err) // 預留，以後可以記log用
}
module.exports = errorHandler
