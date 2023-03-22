'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      User_id: DataTypes.INTEGER,
      Tweet_id: DataTypes.INTEGER,
      Reply_id: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {},
  );
  Reply.associate = function (models) {
    Reply.belongsTo(models.User);
    Reply.belongsTo(models.Tweet);
    Reply.hasMany(models.Like, { foreignKey: 'Position_id' });
    Reply.hasMany(models.Reply, {
      as: 'followingByReply',
      foreignKey: 'Reply_id',
      useJunctionTable: false,
    });
    Reply.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'Position_id',
      as: 'LikedByUsers',
    });
  };
  return Reply;
};
