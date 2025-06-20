import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  fullname: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  /** 🔄 Restore auth state from AsyncStorage */
  rehydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  setUser: user => {
    AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setToken: token => {
    AsyncStorage.setItem('token', token);
    set({ token });
  },

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null, loading: false, error: null });
  },

  // 🔄 Rehydrate Zustand store from AsyncStorage
  rehydrate: async () => {
    const token = await AsyncStorage.getItem('token');
    const userString = await AsyncStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    if (token && user) {
      set({ token, user });
    }
  },
}));
