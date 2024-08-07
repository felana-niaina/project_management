import { create } from "zustand";
import { TSprint } from "../types/Sprint";

interface SprintState {
  sprint : TSprint;
  listSprint: TSprint[]; // Stocke tous les backlogs
  setListSprint: (data: TSprint[]) => void; // Met à jour la liste de tous les backlogs
  SprintsByProject: { [idProject: string]: TSprint[] }; // Stocke les listes de backlog par idProject
  setSprintsByProject: (data: { [idProject: string]: TSprint[] }) => void; // Met à jour les listes de backlog par idProject
}

const SprintStore = create<SprintState>((set) => ({
  sprint:{
    id:"",
    idProject:"",
    name:"",
    startDate:"",
    endDate:"",
    column: [],
  },
    listSprint: [],
    setListSprint: (data) => set({ listSprint: data }),
    SprintsByProject: {},
    setSprintsByProject: (data) => set({ SprintsByProject: data }),
}));

export default SprintStore;

