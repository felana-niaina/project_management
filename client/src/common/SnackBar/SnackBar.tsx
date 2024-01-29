import Snackbar from "@mui/material/Snackbar";
import { FC, useState } from "react";

type TProps = {
  open: boolean;
  message: string;
};

const SnackBar: FC<TProps> = ({ open, message }) => {
  const [openSnack, setOpen] = useState(open);
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div>
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
      />
    </div>
  );
};

export default SnackBar;
