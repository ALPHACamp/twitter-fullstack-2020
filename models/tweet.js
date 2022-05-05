'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Tweet.init(
    {
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'Tweets'
    }
  );
  return Tweet;
};