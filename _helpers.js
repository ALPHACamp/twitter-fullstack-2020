function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function isMatch(a , b) {
  if (a === b) { 
    return true
  } else {
    return false
    }
  }

module.exports = {
  ensureAuthenticated,
  getUser,
  isMatch
};