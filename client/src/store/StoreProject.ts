import { create } from "zustand";
import { TProject } from "../types/Project";

interface ProjectState {
  project: TProject;
  listProject: TProject[] | [];
  setProject: (data: TProject) => void;
  setListProject: (data: TProject[]) => void;
}

const ProjectStore = create<ProjectState>()((set) => ({
  project: {
    name: "",
    column: [],
  },
  listProject: [],
  setProject: (data: TProject) => set({ project: data }),
  setListProject: (data: TProject[]) => set({ listProject: data }),
}));

export default ProjectStore;
