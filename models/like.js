'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: DataTypes.INTEGER,
      Position: DataTypes.STRING,
      PositionId: DataTypes.INTEGER,
      isLike: DataTypes.BOOLEAN,
      TweetId: DataTypes.INTEGER,
    },
    {},
  );
  Like.associate = function (models) {
    Like.belongsTo(models.User);
    Like.belongsTo(models.Tweet, {
      foreignKey: 'PositionId',
      constraints: false,
      scope: {
        Position: 'tweet',
      },
    });
    Like.belongsTo(models.Reply, {
      foreignKey: 'PositionId',
      constraints: false,
      scope: {
        Position: 'reply',
      },
    });
  };
  return Like;
};
