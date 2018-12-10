import { gql } from 'apollo-server-express';

export default gql`
  type BusinessError {
    path: String!
    message: String!
    code: String!
  }
`;
