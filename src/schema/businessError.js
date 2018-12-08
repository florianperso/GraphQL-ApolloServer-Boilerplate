import { gql } from 'apollo-server-express';

export default gql`
  type BusinessError {
    location: String!
    message: String!
    code: String!
  }
`;
