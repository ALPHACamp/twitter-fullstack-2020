'use strict'
const { DataTypes, Model } = require('sequelize')

module.exports = sequelize => {
  class Reply extends Model {
    static associate(models) {
      //* 回覆屬於tweet和user
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Reply.init(
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Reply',
      tableName: 'Replies',
      underscored: true
    }
  )
  return Reply
}
