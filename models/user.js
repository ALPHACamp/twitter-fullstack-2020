'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    cover: DataTypes.STRING,
    account: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Reply);
    User.hasMany(models.Tweet);
    User.hasMany(models.Like);
    User.hasMany(models.Message);
    //self-referential super-many-to-many
    User.hasMany(models.Followship, { as: 'FollowerLinks', foreignKey: 'followerId' });
    User.hasMany(models.Followship, { as: 'FollowingLinks', foreignKey: 'followingId' });

    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    });
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    });
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
  };
  return User;
};