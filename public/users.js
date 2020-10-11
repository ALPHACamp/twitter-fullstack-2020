const user = require("../models/user");

const users = [];

//join user to chat

function userJoin(id, username) {
  const user = { id, username };

  users.push(user);

  return user;
}

//get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id)
}

module.exports = {
  userJoin,

}