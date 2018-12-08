import { requiresSessionAction } from "../utils/permissions";

const resolvers = {
  Query: {
    getAllUserSessions: requiresSessionAction.createResolver(
      async (_, __, { models }) => {
        return await models.Session.findAll();
      },
    ),
    getSessionByToken: requiresSessionAction.createResolver(
      async (_, { token }, { models }) => {
        return await models.Session.findOne({ where: { token } });
      },
    ),
    getSessionsByUser: requiresSessionAction.createResolver(
      async (_, { userId }, { models }) => {
        return await models.Session.findAll({ where: { userId } });
      },
    ),
  },
  Mutation: {
    closeSessionByToken: requiresSessionAction.createResolver(
      async (_, { token }, { models }) => {
        const response = await models.Session.destroy({
          where: { token },
        });
        if (response) {
          return {
            ok: true,
          };
        }
        return {
          ok: false,
        };
      },
    ),
    closeUserSessions: requiresSessionAction.createResolver(
      async (_, { userId }, { models }) => {
        const response = await models.Session.destroy({
          where: { userId },
        });
        if (response) {
          return {
            ok: true,
          };
        }
        return {
          ok: false,
        };
      },
    ),
    closeAllSessions: requiresSessionAction.createResolver(
      async (_, __, { models }) => {
        const response = await models.Session.destroy({ where: {} });
        if (response) {
          return {
            ok: true,
          };
        }
        return {
          ok: false,
        };
      },
    ),
  },
  Session: {
    user: ({ userId }, args, { models, user }) =>
      models.User.findOne(
        { where: { id: userId } },
        { raw: true, model: models.User },
      ),
  },
};

export default resolvers;
