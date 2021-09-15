'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Reply)
  };
  return User;
};