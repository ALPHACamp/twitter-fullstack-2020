

module.exports = {
  ensureAuthenticated: (req) => {
    return req.isAuthenticated();
  }
};