module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) { // 如果 err 是一個「錯誤物件」
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}
