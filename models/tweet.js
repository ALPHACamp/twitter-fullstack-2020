'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING, 
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User)
  };
  return Tweet;
};