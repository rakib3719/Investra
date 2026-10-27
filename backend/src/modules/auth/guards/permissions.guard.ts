import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AdminPermission } from '../../../common/enums/admin-permission.enum';
import { UserRole } from '../../../common/enums/user-role.enum';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    role?: UserRole;
    permissions?: AdminPermission[];
  };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<AdminPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no specific permissions are tagged, allow access to authenticated user
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Super Admin (ADMIN) has unconditional bypass across all administrative actions
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Sub-Admin must possess at least one of the required permissions
    if (user.role === UserRole.SUB_ADMIN) {
      const userPermissions = user.permissions || [];
      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.includes(perm),
      );

      if (hasPermission) {
        return true;
      }

      throw new ForbiddenException(
        `Access denied. Requires one of: ${requiredPermissions.join(', ')}`,
      );
    }

    throw new ForbiddenException('Administrative privilege required');
  }
}
