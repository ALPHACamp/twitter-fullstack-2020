module.exports = {
  isSigninSignupPage: function (url, options) {
    return ['/signin', '/signup'].includes(url) ? options.fn(this) : options.inverse(this)
  }
}
