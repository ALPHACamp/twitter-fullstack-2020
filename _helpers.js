// 這個是AC專案提供的檔案
function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

function getUser (req) {
  return req.user
}

module.exports = {
  ensureAuthenticated,
  getUser
}
