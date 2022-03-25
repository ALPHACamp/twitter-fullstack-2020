'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'userId' })
  }
  return Tweet
}
