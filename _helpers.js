// 這個是AC專案提供的檔案
function ensureAuthenticated (req) {
  // return req.isAuthenticated() // 原本的AC功能
  const user = getUser(req)
  return !(typeof user === 'undefined' || user === null)
}

function getUser (req) {
  return req.user
}

module.exports = {
  ensureAuthenticated,
  getUser
}
