'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  Tweet.associate = function (models) {
    // associations can be defined here
    Tweet.belongsTo(models.User)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
  };
  return Tweet;
};