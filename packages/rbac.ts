export enum Role {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  SEEKER = 'seeker',
}

export enum Action {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  APPLY = 'apply',
}

export enum Resource {
  RECRUITER = 'recruiter',
  SEEKER = 'seeker',
  HIRING_COMPANY = 'hiringCompany',
  ADMIN = 'admin',
  JOB = 'job',
  APPLICATION = 'application',
  APPLICATION_STATUS = 'applicationStatus',
}

export const RoleResources = {
  [Role.ADMIN]: [Resource.ADMIN, Resource.APPLICATION, Resource.APPLICATION_STATUS, Resource.HIRING_COMPANY, Resource.JOB, Resource.RECRUITER, Resource.SEEKER],
  [Role.RECRUITER]: [Resource.APPLICATION, Resource.APPLICATION_STATUS, Resource.HIRING_COMPANY, Resource.JOB, Resource.RECRUITER, Resource.SEEKER],
  [Role.SEEKER]: [Resource.APPLICATION, Resource.APPLICATION_STATUS, Resource.JOB]
}

export const RolePermissions = {
  [Role.ADMIN]: {
    [Resource.ADMIN]: [Action.CREATE, Action.UPDATE, Action.DELETE, Action.VIEW],
    [Resource.HIRING_COMPANY]: [Action.CREATE, Action.UPDATE, Action.DELETE, Action.VIEW],
    [Resource.RECRUITER]: [
      Action.CREATE,
      Action.UPDATE,
      Action.DELETE,
      Action.VIEW,
    ],
    [Resource.SEEKER]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.JOB]: [Action.UPDATE, Action.DELETE, Action.VIEW],
    [Resource.APPLICATION]: [Action.VIEW],
    [Resource.APPLICATION_STATUS]: [
      Action.VIEW,
    ],
  },
  [Role.RECRUITER]: {
    [Resource.RECRUITER]: [Action.CREATE, Action.UPDATE, Action.DELETE, Action.VIEW],
    [Resource.HIRING_COMPANY]: [Action.UPDATE, Action.VIEW],
    [Resource.JOB]: [Action.CREATE, Action.UPDATE, Action.DELETE, Action.VIEW],
    [Resource.APPLICATION]: [Action.VIEW, Action.UPDATE],
    [Resource.APPLICATION_STATUS]: [Action.VIEW, Action.CREATE, Action.UPDATE],
  },
  [Role.SEEKER]: {
    [Resource.JOB]: [Action.VIEW],
    [Resource.APPLICATION]: [Action.APPLY, Action.UPDATE, Action.VIEW],
    [Resource.APPLICATION_STATUS]: [Action.VIEW],
  },
};
