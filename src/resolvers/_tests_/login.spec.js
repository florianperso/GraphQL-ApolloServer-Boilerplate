import axios from "axios";
import { XMLHttpRequest } from "xmlhttprequest";
import dotenvconfig from "../../utils/dotenvconfig";
import errorCodes from "../../constants/errorCodes";

import { Login } from "./modules/login";
global.XMLHttpRequest = XMLHttpRequest;

dotenvconfig();

describe("user resolvers", () => {
  test("login invalid email", async () => {
    const response = await Login(
      `${process.env.SA_EMAIL}test`,
      process.env.SA_PASSWORD,
      false,
    );

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        login: {
          ok: false,
          businessError: [
            {
              location: "user",
              ...errorCodes.INVALID_CREDENTIALS,
            },
          ],
          user: null,
        },
      },
    });
  });

  test("login invalid password", async () => {
    const response = await Login(
      process.env.SA_EMAIL,
      `${process.env.SA_PASSWORD}test`,
      false,
    );

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        login: {
          ok: false,
          businessError: [
            {
              location: "user",
              ...errorCodes.INVALID_CREDENTIALS,
            },
          ],
          user: null,
        },
      },
    });
  });

  test("login", async () => {
    const response = await Login(
      process.env.SA_EMAIL,
      process.env.SA_PASSWORD,
      false,
    );

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        login: {
          ok: true,
          businessError: null,
          user: {
            username: "sa",
            email: process.env.SA_EMAIL,
          },
        },
      },
    });
  });
});
