import type { PublicUserRole } from './types';

const paths: Record<PublicUserRole, string> = {
  INVESTOR: '/dashboard/investor',
  ENTREPRENEUR: '/dashboard/entrepreneur',
  CONSULTANT: '/dashboard/consultant',
};

export function getDashboardPath(role: PublicUserRole): string {
  return paths[role];
}
