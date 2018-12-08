import { tryLogin } from "../utils/auth";
import { requiresAuth } from "../utils/permissions";
import register from "./user/register";
import generateBusinessError from '../utils/generateBusinessError';

const resolvers = {
  Query: {
    getAllUsers: requiresAuth.createResolver(async (_, __, { models }) => {
      return await models.User.findAll();
    }),
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (_, args, { models }) => {
      return await register(args, models);
    },
  },
  User: {
    role: async ({roleId}, args, { models, user }) =>{
      if(roleId) {
        return await models.UserRole.findOne(
          { where: { id: roleId } },
          { raw: true, model: models.Role },
        )
      } else {
        return null
      }
    }
  }
};

export default resolvers;
