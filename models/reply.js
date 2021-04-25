'use strict'
const model = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      likeCount: DataTypes.INTEGER
    }
  )
  Reply.associate = (models) => {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
    Reply.hasMany(models.Secondreply)
    Reply.hasMany(models.Like)
  }

  return Reply
}

module.exports = model
