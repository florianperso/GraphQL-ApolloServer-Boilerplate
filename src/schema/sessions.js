import { gql } from "apollo-server-express";

export default gql`
  type Session {
    token: String!
    idleAt: String!
    user: User!
  }

  type Query {
    getAllUserSessions: [Session!]
    getSessionByToken(token: String!): Session!
    getSessionsByUser(userId: Int!): [Session!]
  }

  type Mutation {
    closeSessionByToken(token: String!): BaseResponse!
    closeUserSessions(userId: Int!): BaseResponse!
    closeAllSessions: BaseResponse!
  }
`;
