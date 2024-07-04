import { create } from 'zustand';

export type LoadingState = {
  loading: boolean;
};

export type LoadingActions = {
  setLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<LoadingState & LoadingActions>()(set => ({
  loading: true,
  setLoading: loading =>
    set(state => ({
      ...state,
      loading,
    })),
}));
