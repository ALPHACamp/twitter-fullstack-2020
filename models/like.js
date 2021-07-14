'use strict';

const { datatype } = require("faker");

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    }
  }, {});
  Like.associate = function (models) {
    // associations can be defined here
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
  };
  return Like;
};