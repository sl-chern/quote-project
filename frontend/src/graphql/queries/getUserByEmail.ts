import { graphql } from 'gql.tada';

export const getUserByEmailQuery = graphql(`
  query GetUserByEmailQuery($email: String!) {
    getUserByEmail(userEmail: $email) {
      id
    }
  }
`);
