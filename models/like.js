'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' });
      Like.belongsTo(models.Tweet, {
        foreignKey: 'TweetId',
        constraints: false,
        scope: {
          Position: 'tweet',
        },
      });
      Like.belongsTo(models.Reply, {
        foreignKey: 'TweetId',
        constraints: false,
        scope: {
          Position: 'reply',
        },
      });
    };
  }
  Like.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    UserId: DataTypes.INTEGER,
    Position: DataTypes.STRING,
    TweetId: DataTypes.INTEGER,
    isLike: DataTypes.BOOLEAN,
  },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
      underscored: true
    },
  );
  return Like;
};
