'use strict'

module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    comment: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {})
  Reply.associate = function (models) {
    // associations can be defined here
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Tweet)
  }
  return Reply
}