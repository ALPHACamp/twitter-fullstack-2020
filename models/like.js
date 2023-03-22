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
      User_id: DataTypes.INTEGER,
      Position: DataTypes.STRING,
      Position_id: DataTypes.INTEGER,
      is_like: DataTypes.BOOLEAN,
      Tweet_id: DataTypes.INTEGER,
    },
    {},
  );
  Like.associate = function (models) {
    Like.belongsTo(models.User);
    Like.belongsTo(models.Tweet, {
      foreignKey: 'Position_id',
      constraints: false,
      scope: {
        Position: 'tweet',
      },
    });
    Like.belongsTo(models.Reply, {
      foreignKey: 'Position_id',
      constraints: false,
      scope: {
        Position: 'reply',
      },
    });
  };
  return Like;
};
