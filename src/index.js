import express from "express";
import http from "http";
import DataLoader from "dataloader";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import jwt from "jsonwebtoken";

import getModels from "./models";
import seedInitialValues from "./seedInitialValues";
import moment from "moment";
import cronSchedule from "./cronSchedule";
import dotenvconfig from "./utils/dotenvconfig";

dotenvconfig();

const SECRET = process.env.JWT_SECRET;
const SECRET2 = process.env.JWT_SECRET_2;
const FORCE_DB_SYNC = { force: false };

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")), {
  all: true,
});

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers")),
  { all: true },
);

const models = getModels();

const SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: `http://localhost:${process.env.SERVER_PORT}/graphql`,
    settings: {
      "editor.theme": "dark",
    },
  },
  context: async ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    }
    return {
      models,
      user: req.user,
      // token: req.token,
      token: req.headers['x-token'],
      SECRET,
      SECRET2,
      serverUrl: `${req.protocol}://${req.get("host")}`, // + req.originalUrl,
    };
  },
});

const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      if (!user) {
        req.user = null;
        req.token = null;
        return next();
      }

      const session = await models.Session.findOne({
        token,
        userId: user.id,
      });

      if (!session) {
        req.user = null;
        req.token = null;
        return next();
      }

      const dbUser = await models.User.findOne({
        userId: user.id,
      });

      if (dbUser.blocked || dbUser.deleted) {
        req.user = null;
        req.token = null;
        return next();
      }

      const role = await models.UserRole.findOne(
        { where: { id: user.roleId } },
        { raw: true },
      );

      const idleAt = moment().add("milliseconds", role.idleDuration);

      await models.Session.update(
        {
          idleAt,
        },
        { where: { token, userId: user.id } },
      );

      req.user = user;
      req.token = token;
    } catch (error) {
      req.user = null;
      req.token = null;
      return next();
    }
  }
  return next();
};

cronSchedule(models);

const app = express();
app.use(addUser);

SERVER.applyMiddleware({
  app,
});

const httpServer = http.createServer(app);

models.sequelize.sync(FORCE_DB_SYNC).then(async () => {
  await seedInitialValues(models);
  httpServer.listen(process.env.SERVER_PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.SERVER_PORT}${
        SERVER.graphqlPath
      }`,
    );
  });
});
