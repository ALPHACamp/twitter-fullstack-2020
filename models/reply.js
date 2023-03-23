'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {},
  );
  Reply.associate = function (models) {
    Reply.belongsTo(models.User);
    Reply.belongsTo(models.Tweet);
    Reply.hasMany(models.Like, { foreignKey: 'PositionId' });
    Reply.hasMany(models.Reply, {
      as: 'followingByReply',
      foreignKey: 'ReplyId',
      useJunctionTable: false,
    });
    Reply.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'PositionId',
      as: 'LikedByUsers',
    });
  };
  return Reply;
};
