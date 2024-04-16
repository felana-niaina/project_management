import { create } from "zustand";
import { TUser } from "../types/User";

interface UserState {
  user: TUser;
  listUser: TUser[] | [];
  setUser: (data: TUser) => void;
  setListUser: (data: TUser[]) => void;
}
const UserStore = create<UserState>()((set) => ({
  user: {
    id: "",
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    image: "",
    password: "",
    idProject: "",
    role: "",
    isConnected: false,
    isWriting: false,
  },
  listUser: [],
  setUser: (data: TUser) => set({ user: data }),
  setListUser: (data: TUser[]) => set({ listUser: data }),
}));

export default UserStore;
