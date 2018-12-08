export default (sequelize, DataTypes) => {
  const File = sequelize.define("files", {
    filename: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    path: DataTypes.STRING,
    savedname: DataTypes.STRING,
    encoding: DataTypes.STRING,
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return File;
};
