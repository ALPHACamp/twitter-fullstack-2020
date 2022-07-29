'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.belongsTo(models.User)
      Tweet.hasMany(models.Reply)
      Tweet.hasMany(models.Like)
    }
  }
  Tweet.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      description: DataTypes.TEXT,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'Tweets',
      underscored: true
    }
  )
  return Tweet
}
