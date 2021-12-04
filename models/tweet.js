'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      UserId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {}
  )
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers',
    })
    Tweet.belongsToMany(models.User, {
      through: models.Reply,
      foreignKey: 'TweetId',
      as: 'RepliedUsers',
    })
  }
  return Tweet
}
