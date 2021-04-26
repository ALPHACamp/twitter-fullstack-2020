'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate(models) {

      Reply.belongsTo(models.User)
      Reply.belongsTo(models.Tweet)
      // Reply.hasMany(models.Like)
    }
  };

  Reply.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reply',
  });



  return Reply;
};