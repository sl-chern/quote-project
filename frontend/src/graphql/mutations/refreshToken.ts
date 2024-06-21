import { graphql } from 'gql.tada';

export const refreshTokenMutation = graphql(`
  mutation RefreshTokenMutation {
    refresh
  }
`);
