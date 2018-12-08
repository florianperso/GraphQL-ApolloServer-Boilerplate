import { gql } from "apollo-server-express";

export default gql`
  type User {
    username: String!
    email: String!
    confirmed: Boolean!
    blocked: Boolean!
    deleted: Boolean!
    role: UserRole
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    businessError: [BusinessError!]
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    idleAt: String
    refreshToken: String
    businessError: [BusinessError!]
    user: User
  }

  type Query {
    getAllUsers: [User!]!
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    register(
      username: String!
      email: String!
      password: String!
      roleId: Int,
      confirmed: Boolean
    ): RegisterResponse!
  }
`;
