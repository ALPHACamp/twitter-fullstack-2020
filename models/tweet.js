'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedUsers'
      })
    }
  }
  Tweet.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: DataTypes.INTEGER,
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'Tweets'
    }
  )
  return Tweet
}
