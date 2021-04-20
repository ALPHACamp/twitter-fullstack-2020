'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User)
  };
  return Tweet;
};