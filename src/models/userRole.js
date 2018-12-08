import sessionIdleDuration from '../constants/sessionIdleDuration';

export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define("user_roles", {
    title: DataTypes.STRING,
    isdefault: {
      name: "isDefault",
      field: "is_default",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    idleDuration: {
      name: "idleDuration",
      field: "idle_duration",
      type: DataTypes.INTEGER,
      defaultValue: sessionIdleDuration.DEFAULT,
    },
  });

  UserRole.associate = models => {
    UserRole.belongsToMany(models.UserRolePermission, {
      through: "user_role__permission_connections",
      foreignKey: {
        name: "roleId",
        field: "role_id",
      },
    });
  };

  return UserRole;
};
