const getPermissionsFromRole = async (roleId, models) => {
  const [constant] = await models.sequelize.query(`
      SELECT permissions.constant as constant
      FROM "user_roles" AS roles
      LEFT OUTER JOIN ( "user_role__permission_connections" AS connection INNER JOIN "user_role_permissions" AS permissions ON permissions.id = connection.permission_id)
      ON roles.id = connection.role_id
      WHERE roles.id = ${user.roleId} AND permissions.deleted=false;
    `);

  return constant;
};

const createResolver = resolver => {
  const baseResolver = resolver;
  baseResolver.createResolver = childResolver => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver(async (_, __, { user, models }) => {
  if (!user || !user.id) {
    throw new Error("Not authenticated");
  }
});

export const requiresSessionAction = createResolver(
  async (_, __, { user, models }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }

    if (!user.roleId) {
      throw new Error("Not Authorized");
    }

    let constant = getPermissionsFromRole(user.roleId, models)

    let result = constant.some(element => {
      return (
        element.constant === "ALL_ACCESS" ||
        element.constant === "CLOSE_SESSION" ||
        element.constant === "CLOSE_ALL_SESSION"
      );
    });

    if (!result) {
      throw new Error("Not Authorized");
    }
  },
);

export const requiresAdminAction = createResolver(
  async (_, __, { user, models }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }

    if (!user.roleId) {
      throw new Error("Not Authorized");
    }

    let constant = getPermissionsFromRole(user.roleId, models)

    let result = constant.some(element => {
      return element.constant === "ALL_ACCESS";
    });

    if (!result) {
      throw new Error("Not Authorized");
    }
  },
);

export const requiresManageRolesAction = createResolver(
  async (_, __, { user, models }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }

    if (!user.roleId) {
      throw new Error("Not Authorized");
    }

    let constant = getPermissionsFromRole(user.roleId, models)

    let result = constant.some(element => {
      return element.constant === "MANAGE_ROLES";
    });

    if (!result) {
      throw new Error("Not Authorized");
    }
  },
);
