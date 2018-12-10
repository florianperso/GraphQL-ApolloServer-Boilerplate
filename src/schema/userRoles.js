import { gql } from "apollo-server-express";

export default gql`
  type UserRole {
    id: Int!
    title: String!
    isDefault: Boolean!
    idleDuration: Int!
    deleted: Boolean!
    userRolePermissions: [UserRolePermission]
  }

  type RoleResponse {
    ok: Boolean!
    userRole: UserRole
    businessError: [BusinessError!]
  }

  type Mutation {
    createUserRole(title: String!, idleDuration: Int): RoleResponse!
    deleteRole(roleId: Int!): BaseResponse!
    addPermissionToRole(roleId:Int!, permissionId: Int!): RoleResponse!
  }

  type Query {
    getAllRoles: [UserRole!]!
  }

`;
