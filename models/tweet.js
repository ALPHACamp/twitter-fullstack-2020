'use strict'
const model = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      UserId: DataTypes.STRING,
      description: DataTypes.TEXT,
      replyCount: DataTypes.INTEGER,
      likeCount: DataTypes.INTEGER
    }
  )
  Tweet.associate = (models) => {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
  }

  return Tweet
}

module.exports = model

