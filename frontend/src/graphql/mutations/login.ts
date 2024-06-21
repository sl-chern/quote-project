import { graphql } from 'gql.tada';

export const loginMutation = graphql(`
  mutation LoginMutation($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      id
      name
      email
      permissions {
        name
      }
    }
  }
`);
