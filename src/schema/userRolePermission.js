import { gql } from "apollo-server-express";

export default gql`
  type UserRolePermission {
    id: Int!
    title: String!
    isDefault: Boolean!
    constant: String!
    deleted: Boolean!
  }

  type UserRolePermissionResponse {
    ok: Boolean!
    userRolePermission: UserRolePermission
    businessError: [BusinessError!]
  }

  type Mutation {
    createUserRolePermission(title: String!, isDefault: Boolean = false, constant: String!): UserRolePermissionResponse!
    deleteUserRolePermission(id: Int!, migrateExistingToPermissionId: Int): BaseResponseDelete!
  }

  type Query {
    getAllUserRolePermissions: [UserRolePermission!]!
  }
`;
