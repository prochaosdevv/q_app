import { create } from 'zustand';

type ProjectStore = {
  id: string;
  image: string;
  createdBy: string;
  setProjectId: (id: string) => void;
  setProjectImage: (image: string) => void;
  setCreatedBy: (id: string) => void;
};

export const useProjectStore = create<ProjectStore>(set => ({
  id: '',
  image: '',
  createdBy: '',

  setProjectId: (id: string) => {
    set({ id });
  },

  setProjectImage: (image: string) => {
    set({ image });
  },
  setCreatedBy: (id: string) => {
    set({ createdBy: id });
  },
}));
