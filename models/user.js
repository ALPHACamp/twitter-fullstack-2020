module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type  : DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    account : {
      type  : DataTypes.STRING,
      unique: true,
    },
    name        : DataTypes.STRING,
    avatar      : DataTypes.STRING,
    introduction: DataTypes.TEXT,
    cover       : DataTypes.STRING,
    role        : DataTypes.STRING,
    createdAt   : DataTypes.DATE,
    updatedAt   : DataTypes.DATE,
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet);
    User.hasMany(models.Reply);
    User.hasMany(models.Like);
    User.belongsToMany(User, {
      through   : models.Followship,
      foreignKey: 'followingId',
      as        : 'Followers',
    });
  };
  return User;
};
