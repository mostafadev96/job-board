import { SetMetadata } from '@nestjs/common';
import { Action, Resource } from '../utils/auth-util';

export const PERMISSION_KEY = 'permission';

export const Permission = (resource: Resource, action: Action) =>
  SetMetadata(PERMISSION_KEY, { resource, action });
