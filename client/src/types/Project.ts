import { TColumn } from "./Column";

export type TProject = {
  name: string;
  startDate: string;
  endDate: string;
  description : string;
  column: TColumn[] | [];
};
