import { create } from 'zustand';
import { User } from '@/types/common.types';
import { getCurrentUser, mockUsers } from '@/constants/mockData';

interface UserState {
  currentUser: User | null;
  users: User[];
  
  // Actions
  fetchCurrentUser: () => void;
  fetchUsers: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  users: [],
  
  fetchCurrentUser: () => {
    // In a real app, this would be an API call
    set({ currentUser: getCurrentUser() });
  },
  
  fetchUsers: () => {
    // In a real app, this would be an API call
    set({ users: mockUsers });
  }
}));
