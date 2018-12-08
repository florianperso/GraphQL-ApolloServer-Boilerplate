import { requiresManageRolesAction, requiresAuth } from "../utils/permissions";
import errorCodes from "../constants/errorCodes";

const resolvers = {
  Mutation: {
    createUserRole: requiresManageRolesAction.createResolver(
      async (_, args, { models }) => {
        try {
          const userRole = await models.UserRole.create(args);
          if (userRole) {
            return {
              ok: true,
              userRole,
            };
          } else {
            return {
              ok: false,
            };
          }
        } catch (error) {
          return {
            ok: false,
          };
        }
      },
    ),
    deleteRole: requiresManageRolesAction.createResolver(
      async (_, { roleId }, { models }) => {
        let userLinkedCount = await models.User.count({
          where: { roleId },
        });

        if (userLinkedCount > 0) {
          return {
            ok: false,
            businessError: {
              path: "UserRole",
              ...errorCodes.ROLE_STILL_IN_USE,
            },
          };
        }
        try {
          let result = await models.UserRole.destroy({
            where: { roleId },
          });

          if (!result) {
            return {
              ok: false,
              businessError: {
                path: "UserRole",
                ...errorCodes.ERROR_OCCURED,
                message: "an error occured deleting the role",
              },
            };
          }
          return {
            ok: true
          }
        } catch (error) {
          return {
            ok: false,
            businessError: {
              path: "UserRole",
              ...errorCodes.ERROR_OCCURED,
              message: "an error occured deleting the role",
            },
          };
        }
      },
    ),
  },
  Query: {
    getAllRoles: requiresAuth.createResolver(async (_, __, { models }) => {
      return await models.UserRole.findAll();
    }),
  },
};

export default resolvers;
