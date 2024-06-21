import { create } from 'zustand';
import { User } from '@/types/models/User';

export type UserState = {
  user?: User;
};

export type UserActions = {
  setUser: (user: User) => void;
  removeUser: () => void;
};

export const useUserStore = create<UserState & UserActions>()(set => ({
  user: undefined,
  setUser: user =>
    set(state => ({
      ...state,
      user,
    })),
  removeUser: () =>
    set(state => ({
      ...state,
      user: undefined,
    })),
}));
