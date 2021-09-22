const db = require('./models')
const User = db.User
const helpers = require('./_helpers')



function ensureAuthenticated(req) {
  console.log('================')
  console.log('進入req.isAuthenticated()')
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function removeUser(Array, id) {
  Array.splice(Array.findIndex(x => x.id === id), 1)
}

function removeadmin(Array) {
  Array.splice(Array.findIndex(x => x.role = true), 1)
}

module.exports = {
  ensureAuthenticated,
  getUser,
  removeUser,
  removeadmin,
};