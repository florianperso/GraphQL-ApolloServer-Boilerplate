import axios from "axios";
import { XMLHttpRequest } from "xmlhttprequest";
import dotenvconfig from "../../../utils/dotenvconfig";

global.XMLHttpRequest = XMLHttpRequest;

dotenvconfig();

export const CreateRole = async (roleTitle, idleDuration, token) => {
  const response = await axios.post(
    `http://localhost:${process.env.SERVER_PORT}/graphql`,
    {
      query: `
        mutation{
          createUserRole(title: "${roleTitle}", idleDuration: ${idleDuration}) {
            ok
            userRole {
              id
              title
              idleDuration
            }
          }
        }
      `,
    },
    {
      headers: {
        "x-token": token,
      },
    },
  );

  return response;
};
