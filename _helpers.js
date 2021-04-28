let x = 0
let y = 6
let z = 0
function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function getTweet(req) {
  return req.tweet;
}

function randomPost(a) {
  if (a % 3 == 0) {
    x++
  } else {
    x = x
  }
  return x
}
function randomFollower(a) {
  if (z == (y - 2)) {
    z = 0
    y = y - 1
  } else {
    y = y
    z++
  }
  return y
}

module.exports = {
  ensureAuthenticated,
  getUser,
  getTweet,
  randomPost,
  randomFollower
}