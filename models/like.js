'use strict'

const model = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      SecondreplyId: DataTypes.INTEGER
    }
  )
  Like.associate = (models) => {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
    Like.belongsTo(models.Reply)
    Like.belongsTo(models.Secondreply)
  }

  return Like
}

module.exports = model

