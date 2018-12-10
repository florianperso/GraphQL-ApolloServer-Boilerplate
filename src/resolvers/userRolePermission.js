import errorCodes from "../constants/errorCodes";
import { requiresManageRolesAction, requiresAuth } from "../utils/permissions";
import { generateBusinessErrorWithErrorConstant } from "../utils/generateBusinessError";

const resolvers = {
  Mutation: {
    deleteUserRolePermission: requiresManageRolesAction.createResolver(
      async (_, { id, migrateExistingToPermissionId }, { models }) => {
        try {
          await models.sequelize.transaction(
            async transaction => {
              if (migrateExistingToPermissionId) {
                const findMigratingToPermission = models.UserRolePermission.count(
                  {
                    where: { id: migrateExistingToPermissionId },
                  },
                  { raw: true, transaction },
                );

                if (!findMigratingToPermission) {
                  return {
                    ok: false,
                    businessError: [
                      {
                        path: "UserRolePermission",
                        ...errorCodes.ROLE_PERMISSION_MIGRATING_DOESNT_EXISTS,
                      },
                    ],
                  };
                }

                const [role_id] = await models.sequelize.query(
                  `
                    SELECT distinct(u.role_id) FROM user_role__permission_connections AS u
                    WHERE u.permission_id = :id 
                    AND u.role_id NOT IN (
                      SELECT distinct(p.role_id) 
                      FROM user_role__permission_connections AS p 
                      WHERE p.permission_id = :migrateExistingToPermissionId
                    )
                  `,
                  {
                    replacements: { id, migrateExistingToPermissionId },
                  },
                  { transaction },
                );

                if (role_id) {
                  // Will update all role permission connections where role
                  // is not already connected to the migration permission
                  const ids = role_id.map(item => item.role_id);

                  await models.UserRolePermissionConnection.update(
                    { permissionId: migrateExistingToPermissionId },
                    { where: { roleId: ids, permissionId: id } },
                    { transaction },
                  );
                }
              }

              await models.UserRolePermissionConnection.destroy(
                {
                  where: { permissionId: id },
                },
                { transaction },
              );

              await models.UserRolePermission.destroy(
                {
                  where: { id },
                },
                { transaction },
              );
            },
          );
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            businessError: generateBusinessErrorWithErrorConstant(
              error,
              models,
              errorCodes.ERROR_DELETE_ROLE_PERMISSION,
              "UserRolePermission",
            ),
          };
        }
      },
    ),
    createUserRolePermission: requiresManageRolesAction.createResolver(
      async (_, { title, isDefault, constant }, { models }) => {
        const alreadyExists = await models.UserRolePermission.findOne(
          {
            where: { constant },
          },
          { raw: true },
        );

        if (alreadyExists) {
          return {
            ok: false,
            businessError: [
              {
                path: "UserRolePermission",
                ...errorCodes.ROLE_PERMISSION_ALREADY_EXISTS,
              },
            ],
          };
        }

        try {
          const transac = await models.sequelize.transaction(
            async transaction => {
              if (isDefault) {
                await models.UserRolePermission.update(
                  { isDefault: false },
                  { where: { isDefault: true } },
                  { transaction },
                );
              }
              const permission = await models.UserRolePermission.create(
                {
                  title,
                  constant,
                  isDefault,
                },
                { transaction },
              );

              return permission;
            },
          );

          return {
            ok: true,
            userRolePermission: transac,
          };
        } catch (error) {
          return {
            ok: false,
            businessError: generateBusinessErrorWithErrorConstant(
              error,
              models,
              errorCodes.ERROR_CREATE_ROLE_PERMISSION,
              "UserRolePermission",
            ),
          };
        }
      },
    ),
  },
  Query: {
    getAllUserRolePermissions: requiresManageRolesAction.createResolver(
      async (_, __, { models }) => {
        return await models.UserRolePermission.findAll();
      },
    ),
  },
};

export default resolvers;
