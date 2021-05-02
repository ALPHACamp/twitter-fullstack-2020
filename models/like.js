'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {  
    //test 說應該belongs to user & tweet
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
    
  };
  return Like;
};