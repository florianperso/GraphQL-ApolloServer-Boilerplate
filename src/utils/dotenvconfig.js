import dotenv from "dotenv";

export default () => {
  let path;

  switch (process.env.NODE_ENV) {
    case "test":
      path = `${__dirname}/../../.env.test`;
      break;
    default:
      path = `${__dirname}/../../.env`;
  }

  dotenv.config({ path: path });
};
