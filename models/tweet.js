'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      description: DataTypes.TEXT,
      User_id: DataTypes.INTEGER,
    },
    {},
  );
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User);
    Tweet.hasMany(models.Reply);
    Tweet.hasMany(models.Like, { foreignKey: 'Position_id' });
    Tweet.belongsToMany(models.User, {
      through: { model: models.Like, scope: { Position: 'tweet' } },
      foreignKey: 'Position_id',
      constraints: false,
      as: 'LikedByUsers',
    });
  };
  return Tweet;
};

