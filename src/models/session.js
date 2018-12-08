export default (sequelize, DataTypes) => {
  const Session = sequelize.define("sessions", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    idleAt: {
      name: "idleAt",
      field: "idle_at",
      type: DataTypes.DATE,
    },
  });

  Session.associate = models => {
    Session.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
  };

  return Session;
};
