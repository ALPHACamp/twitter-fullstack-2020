'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      account: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
      introduction: DataTypes.STRING,
      cover: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers',
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'FollowerId',
      as: 'followings',
    })
  }
  return User
}
