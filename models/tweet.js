'use strict';

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
    Tweet.hasMany(models.Like)
  };
  return Tweet;
};