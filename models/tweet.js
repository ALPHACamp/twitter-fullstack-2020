'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  Tweet.associate = function (models) {
    // associations can be defined here
    Tweet.belongsTo(models.User)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'tweetId',
      as: 'LikedUsers'
    })
    Tweet.hasMany(model.Reply)
  };
  return Tweet;
};