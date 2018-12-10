import dotenvconfig from "../../utils/dotenvconfig";

import { Login } from "./modules/login";
import { GetSessionByToken, CloseAllSessions, GetSessionsByUserId, GetAllUserSessions } from "./modules/session";

dotenvconfig();

describe("session resolvers", () => {
  test("session must exists after login", async () => {
    const response = await Login(
      `${process.env.SA_EMAIL}`,
      process.env.SA_PASSWORD,
      true,
      true,
    );
    const {
      data: {
        login: {
          token,
          user: { id },
          businessError,
        },
      },
    } = response.data;

    expect(businessError).toBe(null);

    const session = await GetSessionByToken(token);
    expect(session.data.data.getSessionByToken.token).toBe(token);
    expect(session.data.data.getSessionByToken.user.id).toBe(id);
  });

  test("find session by user id", async () => {
    const response = await Login(
      `${process.env.SA_EMAIL}`,
      process.env.SA_PASSWORD,
      true,
      true,
    );
    const {
      data: {
        login: {
          token,
          user: { id },
          businessError,
        },
      },
    } = response.data;

    expect(businessError).toBe(null);

    const session = await GetSessionsByUserId(token, id);
    expect(session.data.data.getSessionsByUser.length).toBeGreaterThanOrEqual(1);
  });

  test("get all user sessions", async () => {
    const response = await Login(
      `${process.env.SA_EMAIL}`,
      process.env.SA_PASSWORD,
      true,
      true,
    );
    const {
      data: {
        login: {
          token,
          user: { id },
          businessError,
        },
      },
    } = response.data;

    expect(businessError).toBe(null);

    const session = await GetAllUserSessions(token);
    expect(session.data.data.getAllUserSessions.length).toBeGreaterThanOrEqual(1);
  });

  test("delete all sessions when logged with session rights must delete all but current", async () => {
    const response = await Login(
      `${process.env.SA_EMAIL}`,
      process.env.SA_PASSWORD,
      true,
      true,
    );
    const {
      data: {
        login: {
          token,
          user: { id },
          businessError,
        },
      },
    } = response.data;

    // create dummy sessions
    await Login(`${process.env.SA_EMAIL}`, process.env.SA_PASSWORD);
    await Login(`${process.env.SA_EMAIL}`, process.env.SA_PASSWORD);
    await Login(`${process.env.SA_EMAIL}`, process.env.SA_PASSWORD);

    const closeAllSessions = await CloseAllSessions(token);
    const {
      data: {
        closeAllSessions: { ok, affectedSessionCount },
      },
    } = closeAllSessions.data;

    expect(ok).toBe(true);
    expect(affectedSessionCount).toBeGreaterThanOrEqual(3);

    const session = await GetSessionByToken(token);
    expect(session.data.data.getSessionByToken.token).toBe(token);
    expect(session.data.data.getSessionByToken.user.id).toBe(id);
  });
});
