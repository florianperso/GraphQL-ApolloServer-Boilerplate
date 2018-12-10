import axios from "axios";
import { XMLHttpRequest } from "xmlhttprequest";
import dotenvconfig from "../../../utils/dotenvconfig";

global.XMLHttpRequest = XMLHttpRequest;

dotenvconfig();

export const GetSessionByToken = async token => {
  const response = await axios.post(
    `http://localhost:${process.env.SERVER_PORT}/graphql`,
    {
      query: `
        query {
          getSessionByToken(token: "${token}") {
            token
            idleAt
            user {
              username
              id
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

export const GetSessionsByUserId = async (token, userId) => {
  const response = await axios.post(
    `http://localhost:${process.env.SERVER_PORT}/graphql`,
    {
      query: `
        query {
          getSessionsByUser(userId: ${userId}) {
            token
            idleAt
            user {
              username
              id
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

export const GetAllUserSessions = async token => {
  const response = await axios.post(
    `http://localhost:${process.env.SERVER_PORT}/graphql`,
    {
      query: `
        query {
          getAllUserSessions {
            token
            idleAt
            user {
              username
              id
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

export const CloseAllSessions = async token => {
  const response = await axios.post(
    `http://localhost:${process.env.SERVER_PORT}/graphql`,
    {
      query: `
        mutation{
          closeAllSessions {
            ok
            affectedSessionCount
            businessError{
              message
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
