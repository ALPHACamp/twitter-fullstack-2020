'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING, 
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User)

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'TweetWhoLike'
    })

    Tweet.belongsToMany(models.User, {
      through: models.Reply,
      foreignKey: 'TweetId',
      as: 'whoReply'
    })
  };
  return Tweet;
};