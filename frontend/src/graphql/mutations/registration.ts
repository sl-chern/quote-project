import { graphql } from 'gql.tada';

export const registrationMutation = graphql(`
  mutation RegistrationMutation($email: String!, $username: String!, $password: String!) {
    registration(registrationInput: { email: $email, name: $username, password: $password }) {
      name
    }
  }
`);
