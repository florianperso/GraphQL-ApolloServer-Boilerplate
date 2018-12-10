import { requiresManageRolesAction, requiresAuth } from "../utils/permissions";
import errorCodes from "../constants/errorCodes";
import { generateBusinessErrorWithErrorConstant } from '../utils/generateBusinessError';

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
            businessError: [
              {
                path: "UserRole",
                ...errorCodes.ROLE_STILL_IN_USE,
              },
            ],
          };
        }
        try {
          await models.UserRolePermissionConnection.destroy({
            where: { roleId },
          });
          let result = await models.UserRole.destroy({
            where: { roleId },
          });

          if (!result) {
            return {
              ok: false,
              businessError: [
                {
                  path: "UserRole",
                  ...errorCodes.ERROR_OCCURED,
                  message: "an error occured deleting the role",
                },
              ],
            };
          }
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            businessError: [
              {
                path: "UserRole",
                ...errorCodes.ERROR_OCCURED,
                message: "an error occured deleting the role",
              },
            ],
          };
        }
      },
    ),
    addPermissionToRole: requiresManageRolesAction.createResolver(
      async (_, { roleId, permissionId }, { models }) => {
        try {
          const roleCheck = await models.UserRole.count(
            {
              where: { id: roleId },
            },
            { raw: true },
          );

          if (!roleCheck) {
            return {
              ok: false,
              businessError: [{
                path: "UserRole",
                ...errorCodes.ROLE_DOESNT_EXISTS,
              }],
            };
          }

          const permissionCheck = await models.UserRolePermission.count(
            {
              where: { id: permissionId },
            },
            { raw: true },
          );

          if (!permissionCheck) {
            return {
              ok: false,
              businessError: [{
                path: "UserRole",
                ...errorCodes.ROLE_PERMISSION_DOESNT_EXISTS,
              }],
            };
          }

          let permissionConnection = await models.UserRolePermissionConnection.findOne(
            { where: { roleId, permissionId } },
            { raw: true },
          );

          if (permissionConnection) {
            return {
              ok: false,
              businessError: [{
                path: "UserRole",
                ...errorCodes.ROLE_PERMISSION_CONNECTION_ALREADY_EXISTS,
              }],
            };
          }

          permissionConnection = await models.UserRolePermissionConnection.create(
            {
              permissionId,
              roleId,
            },
          );

          const userRole = await models.UserRole.findOne(
            {
              where: { id: roleId },
            },
            { raw: true },
          );

          return {
            ok: true,
            userRole,
          };
        } catch (error) {
          return {
            ok: false,
            businessError: generateBusinessErrorWithErrorConstant(
              error,
              models,
              errorCodes.ERROR_OCCURED,
            ),
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
  UserRole: {
    userRolePermissions: async ({ roleId }, args, { models, user }) => {
      if (user.roleId) {
        const result = await models.sequelize.query(
          `
          SELECT permissions.*
          FROM "user_roles" AS roles
          LEFT OUTER JOIN ( "user_role__permission_connections" AS connection INNER JOIN "user_role_permissions" AS permissions ON permissions.id = connection.permission_id)
          ON roles.id = connection.role_id
          WHERE roles.id = ${user.roleId} AND permissions.deleted=false;
        `,
          {
            model: models.UserRolePermission,
            raw: true,
          },
        );
        const final = [];
        result.forEach(element => {
          element.isDefault = element["is_default"];
          final.push(element);
        });
        return final;
      } else {
        return null;
      }
    },
  },
};

export default resolvers;
