import { User, UserRole } from '@/types/common.types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@testautomation.com',
    role: UserRole.ADMIN,
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2023-05-15T08:30:00Z'
  },
  {
    id: '2',
    username: 'john.doe',
    email: 'john.doe@testautomation.com',
    role: UserRole.TESTER,
    createdAt: '2023-01-15T00:00:00Z',
    lastLogin: '2023-05-14T14:20:00Z'
  },
  {
    id: '3',
    username: 'jane.smith',
    email: 'jane.smith@testautomation.com',
    role: UserRole.DEVELOPER,
    createdAt: '2023-02-01T00:00:00Z',
    lastLogin: '2023-05-15T09:45:00Z'
  },
  {
    id: '4',
    username: 'bob.johnson',
    email: 'bob.johnson@testautomation.com',
    role: UserRole.VIEWER,
    createdAt: '2023-03-10T00:00:00Z',
    lastLogin: '2023-05-10T11:15:00Z'
  },
  {
    id: '5',
    username: 'alice.williams',
    email: 'alice.williams@testautomation.com',
    role: UserRole.TESTER,
    createdAt: '2023-04-05T00:00:00Z',
    lastLogin: '2023-05-15T10:30:00Z'
  }
];

export const getCurrentUser = (): User => {
  return mockUsers[0]; // Return admin user as current user
};
