'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.belongsToMany(models.Tweet, {
      though: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
  };
  return User;
};