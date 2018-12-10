import { gql } from "apollo-server-express";

export default gql`
  type BaseResponse {
    ok: Boolean!
    businessError: [BusinessError!]
  }

  type BaseResponseDelete {
    ok: Boolean!
    businessError: [BusinessError!]
    affectedRecordsCount: Int!
  }
`;
