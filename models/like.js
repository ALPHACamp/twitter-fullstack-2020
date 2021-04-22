'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {

      Like.belongsTo(models.User)
      Like.belongsTo(models.Tweet)
      Like.belongsTo(models.Reply)
    }
  };

  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });



  return Like;
};