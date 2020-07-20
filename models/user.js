'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
  };
  return User;
};