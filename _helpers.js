function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return testmerge;
}

module.exports = {
  ensureAuthenticated,
  getUser,
};
