import axios from "axios";
import { XMLHttpRequest } from "xmlhttprequest";
import dotenvconfig from "../../../utils/dotenvconfig";

global.XMLHttpRequest = XMLHttpRequest;

dotenvconfig();

export const Login = async (
  email,
  password,
  withToken = true,
  withId = false,
) => {
  const response = await axios.post(
    `http://localhost:${process.env.SERVER_PORT}/graphql`,
    {
      query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            ok
            ${withToken ? "token" : ""}
            businessError {
              path
              message
              code
            }
            user {
              ${withId ? "id" : ""}
              username
              email
            }
          }
        }
        `,
    },
  );

  return response;
};
