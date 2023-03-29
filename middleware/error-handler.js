module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('wrong_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('wrong_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}