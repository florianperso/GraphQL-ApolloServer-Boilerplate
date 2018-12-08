import Sequelize from "sequelize";
import fs from "fs";
import path from "path";

const toTitleCase = str => {
  str = str.split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

export default () => {
  console.log('TEST MODE', process.env.DB_NAME)
  const sequelize = new Sequelize(process.env.DB_NAME, "postgres", "postgres", {
    dialect: "postgres",
    host: "localhost",
    operatorsAliases: Sequelize.Op,
    define: {
      underscored: true,
    },
    logging: console.log,
  });

  // Will read every files from models and extract a
  // Sequelize model from it while creating the correct associations

  let models = {};
  const files = fs.readdirSync(path.join(__dirname, ""));

  files.forEach((file, index) => {
    if (path.extname(file) === ".js" && file !== "index.js") {
      models[toTitleCase(path.parse(file).name)] = sequelize.import(
        `./${file}`,
      );
    }
  });

  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  return models;
};
