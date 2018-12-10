import { gql } from "apollo-server-express";

export default gql`
  type Session {
    token: String!
    idleAt: String!
    user: User
  }

  type CloseSessionResponse {
    ok: Boolean!
    businessError: [BusinessError!]
    affectedSessionCount: Int!
  }

  type Query {
    getAllUserSessions: [Session!]
    getSessionByToken(token: String!): Session!
    getSessionsByUser(userId: Int!): [Session!]
  }

  type Mutation {
    closeSessionByToken(token: String!): CloseSessionResponse!
    closeUserSessions(userId: Int!): CloseSessionResponse!
    closeAllSessions: CloseSessionResponse!
  }
`;
