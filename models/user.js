'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function (models) {
    User.hasMany(models.followship)
    User.hasMany(models.like)
    User.hasMany(models.reply)
    User.hasMany(models.tweet)
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User'
  })
  return User;
};