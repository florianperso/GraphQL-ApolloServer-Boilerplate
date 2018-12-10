export default (sequelize, DataTypes) => {
  const UserRolePermission = sequelize.define("user_role_permissions", {
    title: DataTypes.STRING,
    constant: DataTypes.STRING,
    isDefault: {
      name: "isDefault",
      field: "is_default",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  UserRolePermission.associate = models => {
    UserRolePermission.belongsToMany(models.UserRole, {
      through: "user_role__permission_connections",
      foreignKey: {
        name: "permissionId",
        field: "permission_id",
      },
    });
  };

  return UserRolePermission;
};
