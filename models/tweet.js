'use strict'

module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    likes: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER
  })

  Tweet.associate = function (models) {
    // define association here
    Tweet.hasMany(models.Like)
    Tweet.hasMany(models.Reply)
    Tweet.belongsTo(models.User)

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedbyUser'
    })
  };
  return Tweet
}
