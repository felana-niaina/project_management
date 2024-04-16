export type TUser = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  image?: string;
  password: string;
  idProject: string;
  role: any;
  isConnected: boolean;
  isWriting: boolean;
};
