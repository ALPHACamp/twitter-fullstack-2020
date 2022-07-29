'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      Reply.belongsTo(models.User)
      Reply.belongsTo(models.Tweet)
    }
  }
  Reply.init(
    {
      comment: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      tweetId: DataTypes.INTEGER
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
