import moment from "moment";
import { XMLHttpRequest } from "xmlhttprequest";

import dotenvconfig from "../../utils/dotenvconfig";
import errorCodes from "../../constants/errorCodes";
import { Register } from "./modules/register";

global.XMLHttpRequest = XMLHttpRequest;

dotenvconfig();

const generateDummyUser = () => {
  let username = `usr${new Date().getTime().toString()}`;

  username += Math.floor(Math.random() * 1000000000);
  return {
    email: `${username}@usr.com`,
    password: "passwordRegister",
    username,
  };
};

describe("register resolvers", () => {
  let initialUser;
  beforeAll(() => {
    initialUser = {
      ...generateDummyUser(),
    };
  });

  test("register new user", async () => {
    const email = initialUser.email;
    const password = initialUser.password;
    const username = initialUser.username;
    const response = await Register(email, password, username);

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          businessError: null,
          user: {
            username,
            email,
          },
        },
      },
    });
  });

  test("register new user with existing username should fail", async () => {
    const usr = generateDummyUser();
    const email = usr.email;
    const password = initialUser.password;
    const username = initialUser.username;

    const response = await Register(email, password, username);

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: false,
          businessError: [
            {
              path: "username",
              message: "username must be unique",
              code: errorCodes.ERROR_REGISTRATION.code,
            },
          ],
          user: null,
        },
      },
    });
  });

  test("register new user with existing email should fail", async () => {
    const usr = generateDummyUser();
    const email = initialUser.email;
    const password = initialUser.password;
    const username = usr.username;

    const response = await Register(email, password, username);

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: false,
          businessError: [
            {
              path: "email",
              message: "email must be unique",
              code: errorCodes.ERROR_REGISTRATION.code,
            },
          ],
          user: null,
        },
      },
    });
  });
});
