'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: {
        type: DataTypes.STRING,
        defaultValue:
          'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
      },
      introduction: DataTypes.TEXT,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
      },
      account: DataTypes.STRING,
      cover: {
        type: DataTypes.STRING,
        defaultValue:
          'https://cdn.discordapp.com/attachments/918417533680361505/918418130169131028/cover.svg'
      }
    },
    {}
  )
  User.associate = function (models) {
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
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
  }
  return User
}
