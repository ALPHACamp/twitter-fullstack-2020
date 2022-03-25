'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return Tweet
}
