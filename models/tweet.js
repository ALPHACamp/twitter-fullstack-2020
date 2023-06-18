'use strict'
const { DataTypes, Model } = require('sequelize')

module.exports = sequelize => {
  class Tweet extends Model {
    static associate(models) {
      //* 推文
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
      //* 回覆
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      //* 喜歡
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    }
  }
  Tweet.init(
    {
      description: DataTypes.TEXT,
      UserId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'Tweets',
      underscored: true
    }
  )
  return Tweet
}
