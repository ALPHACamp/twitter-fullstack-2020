'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.belongsTo(models.User, {
        foreignKey: 'UserId'
      });
      Tweet.hasMany(models.Reply);
      Tweet.hasMany(models.Like, { foreignKey: 'PositionId' });
      Tweet.belongsToMany(models.User, {
        through: { model: models.Like, scope: { Position: 'tweet' } },
        foreignKey: 'PositionId',
        constraints: false,
        as: 'LikedByUsers',
      });
    };
  }
  Tweet.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  },
  );
  return Tweet;
};

