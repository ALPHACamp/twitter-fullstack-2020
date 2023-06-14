'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' }) // like也順便補上
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like, // 我翻之前就教案是用model.xxx
        foreignKey: 'TweetId',
        as: 'LikedUsers'
      })
    }
  }
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}
