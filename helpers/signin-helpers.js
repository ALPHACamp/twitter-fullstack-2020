function isSigninPage (req) {
  return (req?.route?.path === '/signin')
}

module.exports = { isSigninPage }
