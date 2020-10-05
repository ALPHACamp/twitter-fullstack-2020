'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {});
  Favorite.associate = function(models) {
    // associations can be defined here
  };
  return Favorite;
};