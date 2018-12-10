import { Op } from "sequelize";
import { requiresSessionAction } from "../utils/permissions";
import { generateBusinessErrorWithErrorConstant } from "../utils/generateBusinessError";

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
        try {
          const response = await models.Session.destroy({
            where: { token },
          });

          return {
            ok: true,
            affectedSessionCount: response,
          };
        } catch (error) {
          return {
            ok: false,
            affectedSessionCount: 0,
            businessError: generateBusinessErrorWithErrorConstant(
              error,
              models,
              errorCodes.ERROR_REGISTRATION,
              "register",
            ),
          };
        }
      },
    ),
    closeUserSessions: requiresSessionAction.createResolver(
      async (_, { userId }, { models }) => {
        try {
          const response = await models.Session.destroy({
            where: { userId },
          });

          return {
            ok: true,
            affectedSessionCount: response,
          };
        } catch (error) {
          return {
            ok: false,
            affectedSessionCount: 0,
            businessError: generateBusinessErrorWithErrorConstant(
              error,
              models,
              errorCodes.ERROR_REGISTRATION,
              "register",
            ),
          };
        }
      },
    ),
    closeAllSessions: requiresSessionAction.createResolver(
      async (_, __, { models, token }) => {
        try {
          const response = await models.Session.destroy({
            where: { token: { [Op.not]: token } },
          });

          return {
            ok: true,
            affectedSessionCount: response,
          };
        } catch (error) {
          return {
            ok: false,
            affectedSessionCount: 0,
            businessError: generateBusinessErrorWithErrorConstant(
              error,
              models,
              errorCodes.ERROR_REGISTRATION,
              "register",
            ),
          };
        }
      },
    ),
  },
  Session: {
    user: async ({ userId }, _, { models }) => {
      return await models.User.findOne(
        { where: { id: userId } },
        { raw: true },
      );
    },
  },
};

export default resolvers;
