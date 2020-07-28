'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING, 
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
<<<<<<< HEAD
    //因為測試加入
    Tweet.hasMany(models.Like)

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'TweetWhoLike'
    })    
=======
    Tweet.hasMany(models.Like)
        
>>>>>>> 01fce53e368c53f85282a47df9f0f2ac929adf1d
  };
  return Tweet;
};