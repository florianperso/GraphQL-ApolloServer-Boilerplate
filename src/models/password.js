import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const Password = sequelize.define("passwords", {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: "The password must be between 5 chars and 100 characters",
        },
      },
    },
    expires_on: {
      type: DataTypes.DATE,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    hooks: {
      afterValidate: async pwd => {
        const hashedPassword = await bcrypt.hash(pwd.password, 12);
        // eslint-disable-next-line
        pwd.password = hashedPassword;
      },
    },
  },);

  Password.associate = models => {
    Password.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
  };

  return Password;
};
