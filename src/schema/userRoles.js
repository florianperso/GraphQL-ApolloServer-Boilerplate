import { gql } from "apollo-server-express";

export default gql`
  type UserRole {
    title: String!
    isdefault: Boolean!
    idleDuration: Int!
    deleted: Boolean!
  }

  type RoleResponse {
    ok: Boolean!
    userRole: UserRole
  }

  type Mutation {
    createUserRole(title: String!, idleDuration: Int): RoleResponse!
    deleteRole(roleId: Int!): BaseResponse!
  }

  type Query {
    getAllRoles: [UserRole!]!
  }

`;
