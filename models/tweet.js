'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function (models) {
  };
  Tweet.init({
    description: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Tweet'
  })
  return Tweet;
};