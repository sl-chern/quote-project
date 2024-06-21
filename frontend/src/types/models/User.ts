export interface User {
  id: string | number;
  name: string;
  email: string;
  permissions: Array<string>;
}
