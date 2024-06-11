import { create } from "zustand";
import { TBacklog } from "../types/Backlog";

interface BacklogState {
  listBacklog: TBacklog[]; // Stocke tous les backlogs
  setListBacklog: (data: TBacklog[]) => void; // Met à jour la liste de tous les backlogs
  backlogsByProject: { [idProject: string]: TBacklog[] }; // Stocke les listes de backlog par idProject
  setBacklogsByProject: (data: { [idProject: string]: TBacklog[] }) => void; // Met à jour les listes de backlog par idProject
}

const BacklogStore = create<BacklogState>((set) => ({
  listBacklog: [],
  setListBacklog: (data) => set({ listBacklog: data }),
  backlogsByProject: {},
  setBacklogsByProject: (data) => set({ backlogsByProject: data }),
}));

export default BacklogStore;

