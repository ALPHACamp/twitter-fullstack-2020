module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER,
    },
    UserId   : DataTypes.INTEGER,
    TweetId  : DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.Tweet);
    Like.belongsTo(models.User);
  };
  return Like;
};
