'use strict';
// Use extending model instead of sequelize.define to define model
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      // define association here
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like, 
        foreignKey: 'tweetId',
        as: 'LikedUsers' 
      })
    }
  }
  Tweet.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    // underscored: true
  })
  return Tweet
}
