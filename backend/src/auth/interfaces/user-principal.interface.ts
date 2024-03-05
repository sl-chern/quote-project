import { PermissionType } from '../helpers/permission-type.enum';

export interface UserPrincipal {
  email?: string;
  name?: string;
  permissions?: PermissionType[];
}
