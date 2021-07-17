'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    description: DataTypes.STRING,
    // img換成avatar; bg_img換成cover
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN,
    isNoticed: DataTypes.BOOLEAN,
  }, {});

  User.associate = function (models) {
    // define association here
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Publicmsg)
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweet'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  };
  return User;
};