module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    TweetId: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      allowNull: false,
      type     : DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type     : DataTypes.DATE,
    },
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet);
    Reply.belongsTo(models.User);
  };
  return Reply;
};
