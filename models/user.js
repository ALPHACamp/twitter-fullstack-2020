'use strict'
const model = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      account: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      introduction: DataTypes.STRING,
      role: DataTypes.STRING,
      followerCount: DataTypes.INTEGER,
      followingCount: DataTypes.INTEGER
    }
  )
  User.associate = (models) => {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Secondreply)
    User.hasMany(models.Like)
    User.hasMany(models.Message)
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  }
  return User
}

module.exports = model
