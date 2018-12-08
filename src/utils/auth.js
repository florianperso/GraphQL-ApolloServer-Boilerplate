import jwt from "jsonwebtoken";
import pick from "lodash/pick";
import bcrypt from "bcrypt";
import moment from "moment";
import errorCodes from '../constants/errorCodes';

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    { user: pick(user, ["id", "username", "roleId"]) },
    secret,
    { expiresIn: "1h" },
  );

  const createRefreshToken = jwt.sign(
    {
      user: pick(user, "id"),
    },
    secret2,
    {
      expiresIn: "7d",
    },
  );

  return [createToken, createRefreshToken];
};

export const refreshTokens = async (
  token,
  refreshToken,
  models,
  SECRET,
  SECRET2,
) => {
  let userId = 0;

  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);

    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId, blocked: false, deleted: false }, raw: true });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    refreshSecret,
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  console.log("passord", { SECRET, SECRET2 });
  console.log('ERR', { location: "password", ...errorCodes.EMAIL_NOT_FOUND })
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      businessError: [{ location: "user", ...errorCodes.INVALID_CREDENTIALS }],
    };
  }

  if (user.blocked) {
    return {
      ok: false,
      businessError: [{ location: "user", ...errorCodes.USER_BLOCKED }],
    };
  }

  const pwd = await models.Password.findAll({
    limit: 1,
    where: { userId: user.id },
    order: [["created_at", "DESC"]],
    raw: true,
  });

  const valid = await bcrypt.compare(password, pwd[0].password);
  if (!valid) {
    return {
      ok: false,
      businessError: [{ location: "user", ...errorCodes.INVALID_CREDENTIALS }],
    };
  }

  const refreshTokenSecret = `${user.password + SECRET2}`;
  const [token, refreshToken] = await createTokens(
    user,
    SECRET,
    refreshTokenSecret,
  );

  const role = await models.UserRole.findOne(
    { where: { id: user.roleId } },
    { raw: true },
  );

  const idleAt = moment().add("milliseconds", role.idleDuration);

  const addSession = await models.Session.create({
    userId: user.id,
    token: token,
    idleAt,
  });

  if (!addSession) {
    return {
      ok: false,
      businessError: [{ location: "session", ...errorCodes.CANNOT_CREATE_SESSION }],
    };
  }

  await models.User.update(
    {
      lastLoginDate: moment(),
    },
    { where: { id: user.id } },
  );

  return {
    ok: true,
    token,
    refreshToken,
    idleAt,
    user
  };
};
