module.exports = {
  isSigninSignupPage: function (url, options) {
    return ['/signin', '/signup', '/admin/signin'].includes(url) ? options.fn(this) : options.inverse(this)
  }
}
