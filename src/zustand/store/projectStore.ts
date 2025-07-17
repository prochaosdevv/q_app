import { create } from 'zustand';

type ProjectStore = {
  id: string;
  image: string;
  setProjectId: (id: string) => void;
  setProjectImage: (image: string) => void;
};

export const useProjectStore = create<ProjectStore>(set => ({
  id: '',
  image: '',

  setProjectId: (id: string) => {
    set({ id });
  },

  setProjectImage: (image: string) => {
    set({ image });
  },
}));
