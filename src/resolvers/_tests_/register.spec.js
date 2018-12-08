import { XMLHttpRequest } from "xmlhttprequest";
import dotenvconfig from "../../utils/dotenvconfig";
import errorCodes from "../../constants/errorCodes";

import { Register } from "./modules/register";

global.XMLHttpRequest = XMLHttpRequest;

dotenvconfig();

describe("register resolvers", () => {
  test("register new user", async () => {
    const email = "usr1@usr.com";
    const password = "PasswordRegister";
    const username = "usr1";
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
    const email = "usr2@usr.com";
    const password = "PasswordRegister";
    const username = "usr1";
    const response = await Register(email, password, username);

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: false,
          businessError: [
            {
              location: "register",
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
    const email = "usr1@usr.com";
    const password = "PasswordRegister";
    const username = "usr2";
    const response = await Register(email, password, username);

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: false,
          businessError: [
            {
              location: "register",
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
