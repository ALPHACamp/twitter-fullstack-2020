function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function getAccount(req) {
  return req.account;
}

module.exports = {
  ensureAuthenticated,
  getUser,
  getAccount,
};