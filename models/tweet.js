'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    underscored: true
  })
  Tweet.associate = function (models) {
    // associations can be defined here
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'replyId' })
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'tweetId',
      as: 'LikedUsers'
    })
  }
  return Tweet
}
