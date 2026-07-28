import { create } from 'zustand';

interface ProjectHoverState {
  hoveredProjectId: string | null;
  setHoveredProject: (id: string | null) => void;
}

const useProjectStore = create<ProjectHoverState>((set) => ({
  hoveredProjectId: null,
  setHoveredProject: (id) => set({ hoveredProjectId: id }),
}));

export default useProjectStore;
