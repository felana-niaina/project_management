import { TColumn } from "./Column";

export type TSprint = {
    id: string;
    idProject: string;
    // backlog: string[];
    // priority: string;
    // estimate: string;
    name: string;
    startDate: string;
    endDate: string;
    column: TColumn[] | [];
  };
  