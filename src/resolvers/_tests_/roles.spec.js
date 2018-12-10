import dotenvconfig from "../../utils/dotenvconfig";

import { Login } from "./modules/login";
import { CreateRole } from "./modules/roles";
import moment from 'moment';

dotenvconfig();

const generateDummyRole = () => {
  let title = `role${new Date().getTime().toString()}`;
  title+=Math.floor(Math.random() * 1000000000)
  return {
    title,
    idleDuration: 90000,
  };
};

describe("user roles resolvers", () => {
  test("create a role when logged with session rights should succeed", async () => {
    const response = await Login(
      `${process.env.SA_EMAIL}`,
      process.env.SA_PASSWORD,
      true,
      true,
    );
    const {
      data: {
        login: { token },
      },
    } = response.data;

    const dummyRole = generateDummyRole();
    const createRoleResponse = await CreateRole(
      dummyRole.title,
      dummyRole.idleDuration,
      token,
    );
    const {
      data: {
        createUserRole: {
          ok,
          userRole: { id, title, idleDuration },
        },
      },
    } = createRoleResponse.data;

    expect(ok).toBe(true);
    expect(id).toBeGreaterThanOrEqual(0);
    expect(title).toBe(dummyRole.title);
    expect(idleDuration).toBe(dummyRole.idleDuration);
  });
});
