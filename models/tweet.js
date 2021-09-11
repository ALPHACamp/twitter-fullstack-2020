'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', 
  {
    UserId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    likeCount: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER,
    
  }, {});
  Tweet.associate = function(models) {
  };
  return Tweet;
};