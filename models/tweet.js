'use strict'

module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    likeCount: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER
  }, {})
  Tweet.associate = function (models) {
    // associations can be defined here
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    // 推文藉由使用者的Like產生多對多關聯
    // Tweet.hasMany(models.Like)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
  }
  return Tweet
}