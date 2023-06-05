'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    comment: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    tweet_id: DataTypes.INTEGER
  }, {
    underscored: true
  })
  Reply.associate = function (models) {
    // associations can be defined here
    Reply.belongsTo(models.User, { foreignKey: 'userId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  }
  return Reply
}
