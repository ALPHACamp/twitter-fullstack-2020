const bcrypt = require('bcryptjs')
const db = require('./models')
const Followship = db.Followship
const User = db.User
const Tweet = db.Tweet


function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function removeUser(Array, id) {
  Array.splice(Array.findIndex(x => x.id === id), 1)

}

module.exports = {
  ensureAuthenticated,
  getUser,
  removeUser
};