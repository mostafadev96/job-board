// rbac.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { RolePermissions } from '@job-board/rbac';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const { user } = gqlCtx.getContext().req;

    const { resource, action } = this.reflector.getAllAndOverride(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || {};

    if (!resource || !action) return true; // no permission check

    const role = user.role;
    console.log(role);
    const permissions = RolePermissions[role];
    console.log(permissions);

    if (!permissions) throw new ForbiddenException('No permissions for this role');
    const allowedActions = permissions[resource] || [];
    console.log(allowedActions);

    if (!allowedActions.includes(action)) {
      throw new ForbiddenException(`Access denied for ${action} on ${resource}`);
    }

    return true;
  }
}
