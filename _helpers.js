function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function getTweet(req) {
  return req.tweet;
}
module.exports = {
  ensureAuthenticated,
  getUser,
  getTweet
}