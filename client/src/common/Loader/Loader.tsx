import CircularProgress from "@mui/material/CircularProgress";
import { FC } from "react";

type TProps = {
  isLoading: boolean;
};

const Loader: FC<TProps> = ({ isLoading }) => {
  return (
    <div style={{ position: "absolute", top: "50%", left: "50%" }}>
      {isLoading && <CircularProgress />}
    </div>
  );
};

export default Loader;
