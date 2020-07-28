'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {  
<<<<<<< HEAD
    //test 說應該belongs to user & tweet
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
    
=======
    Like.belongsTo(models.Tweet)
    Like.belongsTo(models.User)
>>>>>>> 01fce53e368c53f85282a47df9f0f2ac929adf1d
  };
  return Like;
};