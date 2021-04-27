'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      description: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
    },
    {},
  );
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User);
    Tweet.hasMany(models.Reply);
    Tweet.hasMany(models.Like, { foreignKey: 'PositionId' });
    Tweet.belongsToMany(models.User, {
      through: { model: models.Like, scope: { Position: 'tweet' } },
      foreignKey: 'PositionId',
      constraints: false,
      as: 'LikedByUsers',
    });
  };
  return Tweet;
};

// tweet 欄位可以自由定
