import { graphql } from 'gql.tada';

export const logoutMutation = graphql(`
  mutation LogoutMutation {
    logout
  }
`);
