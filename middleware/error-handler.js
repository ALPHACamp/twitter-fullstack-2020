module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('errorMessage', `${err.name}: ${err.message}`)
    } else {
      req.flash('errorMessage', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}