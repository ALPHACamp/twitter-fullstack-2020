'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // user 1->m tweet
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      // user 1->m reply
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      // follower and following
      // user 1->m Followship 1->m user
      User.belongsToMany(models.User,
        {
          through: models.Followship,
          foreignKey: 'followingId',
          as: 'Followers'
        }
      )
      User.belongsToMany(models.User,
        {
          through: models.Followship,
          foreignKey: 'followerId',
          as: 'Followings'
        }
      )
      // test檔要求 1 -> m -> 1的關係
      // user 1->m like m->1 tweet
      User.hasMany(models.Like, { foreignKey: 'UserId' })
    }
  }
  User.init({
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: { type: DataTypes.STRING, defaultValue: '/images/icons/ac_icon.svg' },
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    cover: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
