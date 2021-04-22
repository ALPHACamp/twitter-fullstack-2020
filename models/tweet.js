'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {

      Tweet.belongsTo(models.User)
      Tweet.hasMany(models.Like)
      Tweet.hasMany(models.Reply)
    }
  };

  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tweet',
  });



  return Tweet;
};