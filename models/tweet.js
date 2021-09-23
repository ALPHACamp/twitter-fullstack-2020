'use strict';
module.exports = (sequelize, DataTypes) => {

  const Tweet = sequelize.define('Tweet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,

  }, {});
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User);
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' });
    Tweet.hasMany(models.Like);
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })

  };
  return Tweet;
};