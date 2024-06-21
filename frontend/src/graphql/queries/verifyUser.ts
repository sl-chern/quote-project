import { graphql } from 'gql.tada';

export const verifyUserQuery = graphql(`
  query verifyUserQuery {
    verifyUser {
      id
      email
      name
      permissions {
        name
      }
    }
  }
`);
