export default (sequelize, DataTypes) => {
  const UserLog = sequelize.define("user_logs", {
    event: DataTypes.STRING,
  });

  UserLog.associate = models => {
    UserLog.belongsTo(models.User, {
      foreignKey: "userId",
      field: "user_id",
    });
  };

  return UserLog;
};
