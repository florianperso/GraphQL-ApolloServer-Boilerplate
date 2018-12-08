export default (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lastLoginDate: {
      name: "lastLoginDate",
      field: "last_login_date",
      type: DataTypes.DATE,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  User.associate = models => {
    User.belongsTo(models.File, {
      foreignKey: {
        name: "avatarFileId",
        field: "avatar_file_id",
      },
    });
    User.belongsTo(models.UserRole, {
      foreignKey: {
        name: "roleId",
        field: "role_id",
      },
    });
  };

  return User;
};
