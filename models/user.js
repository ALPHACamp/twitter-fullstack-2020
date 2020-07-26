'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    backgroundImg: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)  
    User.hasMany(models.Reply)

    
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'userLike'
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

    });

    User.belongsToMany(models.Reply, {
      through: models.RepliesLikes,
      foreignKey: 'UserId',
      as: 'UserReliesLikes'
    })
  };
  return User;
};
