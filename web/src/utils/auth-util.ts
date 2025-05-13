import { Action, Resource, Role, RolePermissions, RoleResources } from '@job-board/rbac';
const KEY = 'auth-user';

export const storeUser = (user: any, role: string, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(KEY, JSON.stringify({
    ...user,
    role
  }));
};

export const getStoredUser = () => {
  const user = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
  return user ? JSON.parse(user) : null;
};

export const clearStoredUser = () => {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
};

export const items: {
  label: Resource,
  link: string
}[] = [
  {
    label: Resource.ADMIN,
    link: '/dashboard/admins'
  },
  {
    label: Resource.HIRING_COMPANY,
    link: '/dashboard/companies'
  },
  {
    label: Resource.RECRUITER,
    link: '/dashboard/recruiters'
  },
  {
    label: Resource.JOB,
    link: '/dashboard/jobs'
  },
  {
    label: Resource.APPLICATION,
    link: '/dashboard/applications'
  },
  {
    label: Resource.SEEKER,
    link: '/dashboard/seekers'
  },
];

export function canAccessResources(role: Role) {
  const roleStr = role === Role.ADMIN ? 'admin' : role === Role.RECRUITER ? 'recruiter' : 'seeker';
  const newItems = items
  .filter(resourceItem => {
    const permissions = (RolePermissions[roleStr] as Record<Resource, Action[]>)[resourceItem.label];
    return permissions ? permissions.includes(Action.VIEW) : false;
  })
  return [
    {
      label: 'Dahboard' as Resource,
      link: '/dashboard'
    },
    ...newItems
  ]
}


export function canAccess(role: Role, resource: Resource, action: Action) {
  const permissions = role === Role.ADMIN ? 'admin' : role === Role.RECRUITER ? 'recruiter' : 'seeker';
  const allowed = (RolePermissions[permissions] as Record<Resource, Action[]>)[resource] || [];
  return allowed.includes(action);
}