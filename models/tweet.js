'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      // define association here
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
