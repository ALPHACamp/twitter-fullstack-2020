module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId     : DataTypes.INTEGER,
    description: DataTypes.TEXT,
    createdAt  : DataTypes.DATE,
    updatedAt  : DataTypes.DATE,
  }, {});
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply);
    Tweet.hasMany(models.Like);
    Tweet.belongsTo(models.User);
  };
  return Tweet;
};
