function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

function getUser (req) {
  return req.user || null
}

module.exports = {
  ensureAuthenticated,
  getUser
}
