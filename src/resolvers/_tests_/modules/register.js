import axios from "axios";
import { XMLHttpRequest } from "xmlhttprequest";
import dotenvconfig from "../../../utils/dotenvconfig";

global.XMLHttpRequest = XMLHttpRequest;

dotenvconfig();

export const Register = async (email, password, username) => {
  const response = await axios.post(
    `http://localhost:${process.env.SERVER_PORT}/graphql`,
    {
      query: `
        mutation {
          register(
            username: "${username}",
            email: "${email}",
            password: "${password}") {
            ok
            businessError {
              location
              message
              code
            }
            user {
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
