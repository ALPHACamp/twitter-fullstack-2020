const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

const getUser = req => {
  return req.user || null
}

module.exports = {
  ensureAuthenticated,
  getUser
}
