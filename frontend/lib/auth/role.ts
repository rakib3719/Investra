import type { AuthenticatedUserRole } from './types';

const paths: Record<AuthenticatedUserRole, string> = {
  INVESTOR: '/dashboard/investor',
  ENTREPRENEUR: '/dashboard/entrepreneur',
  CONSULTANT: '/dashboard/consultant',
  ADMIN: '/dashboard/admin',
  SUB_ADMIN: '/dashboard/sub_admin',
};

export function getDashboardPath(role: AuthenticatedUserRole): string {
  return paths[role];
}
