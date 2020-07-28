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
<<<<<<< HEAD

    //add cause test
    User.hasMany(models.Like)
    
    
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'userLike'
    }) 
=======
    User.hasMany(models.Like)    
>>>>>>> 01fce53e368c53f85282a47df9f0f2ac929adf1d
    
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
  };
  return User;
};
