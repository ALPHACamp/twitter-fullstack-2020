'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    /*
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })*/
  };
  return Tweet;
};


/*
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.belongsTo(models.User)
      Tweet.hasMany(models.Reply)
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedUsers'
      })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tweet',
  });
  return Tweet;
};*/