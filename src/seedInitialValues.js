import sessionIdleDuration from "./constants/sessionIdleDuration";
import register from "./resolvers/user/register";

const addPermission = async (title, constant, models, transaction) => {
  let permission;

  permission = await models.UserRolePermission.findOne(
    { where: { constant } },
    { raw: true },
  );

  if (!permission) {
    console.log("🖌  create Permission");
    permission = await models.UserRolePermission.create(
      {
        title,
        constant,
      },
      { transaction },
    );
  }

  return permission;
};

const addRole = async (title, idleDuration, models, transaction) => {
  let role;

  role = await models.UserRole.findOne({ where: { title } }, { raw: true });

  if (!role) {
    console.log("🖌  create Permission");
    role = await models.UserRole.create(
      {
        title,
        idleDuration,
      },
      { transaction },
    );
  }

  return role;
};

const addUser = async (
  username,
  email,
  confirmed,
  roleId,
  password,
  models,
) => {
  let user;

  user = await models.User.findOne({ where: { email } }, { raw: true });

  if (!user) {
    user = await register(
      {
        username,
        email,
        confirmed,
        roleId,
        password,
      },
      models,
    );
    console.log("🖌 create SA User");
  }

  return user;
};

const addRolePermissionConnection = async (
  roleId,
  permissionId,
  models,
  transaction,
) => {
  let permissionConnection = await models.UserRolePermissionConnection.findOne(
    { where: { roleId, permissionId } },
    { raw: true },
  );

  if (!permissionConnection) {
    console.log("🖌  create Permission Connection");
    permissionConnection = await models.UserRolePermissionConnection.create(
      {
        permissionId,
        roleId,
      },
      { transaction },
    );
  }

  return permissionConnection;
};

export default async models => {
  let role;
  await models.sequelize.transaction(async transaction => {
    let permission = await addPermission(
      "all access",
      "ALL_ACCESS",
      models,
      transaction,
    );

    let permissionSessionCloseSingle = await addPermission(
      "close a user session",
      "CLOSE_SESSION",
      models,
      transaction,
    );

    let permissionSessionCloseAll = await addPermission(
      "close all users sessions",
      "CLOSE_ALL_SESSION",
      models,
      transaction,
    );

    let permissionManageRoles = await addPermission(
      "manage roles",
      "MANAGE_ROLES",
      models,
      transaction,
    );

    role = await addRole(
      "SUPER_ADMIN",
      sessionIdleDuration.SUPER_ADMIN,
      models,
      transaction,
    );

    await addRolePermissionConnection(
      role.id,
      permission.id,
      models,
      transaction,
    );

    await addRolePermissionConnection(
      role.id,
      permissionSessionCloseSingle.id,
      models,
      transaction,
    );

    await addRolePermissionConnection(
      role.id,
      permissionSessionCloseAll.id,
      models,
      transaction,
    );

    await addRolePermissionConnection(
      role.id,
      permissionManageRoles.id,
      models,
      transaction,
    );
  });

  await addUser(
    "sa",
    process.env.SA_EMAIL,
    true,
    role.id,
    process.env.SA_PASSWORD,
    models,
  );
};
