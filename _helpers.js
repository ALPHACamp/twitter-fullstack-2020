function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function checkId(req) {
  const userId = getUser(req).id
  const requestId = Number(req.params.id)
  return (userId === requestId) ? userId : requestId
}

module.exports = {
  ensureAuthenticated,
  getUser,
  checkId
};