import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import { useState, FC, useEffect } from "react";
import { createColumn } from "../../../../api/column-api";
import { TColumn } from "../../../../types/Column";
import { getSelectedProject } from "../../../../api/project-api";
type TProps = {
  column: TColumn | any;
  open: boolean;
  handleClose: () => void;
  data: TColumn | any;
  projectName: string;
};

const DialogColumn: FC<TProps> = ({
  column,
  open,
  handleClose,
  data,
  projectName,
}) => {
  const [newColumn, setNewColumn] = useState(data);
  useEffect(() => {
    setNewColumn({ ...data });
  }, [data]);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setNewColumn({ ...newColumn, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createColumn(newColumn, projectName);
    await getSelectedProject();
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="name"
              required
              value={newColumn.name}
              onChange={handleFormChange}
              name="name"
              fullWidth
            />
            <Grid item xs={12}>
              <Button
                onClick={handleClose}
                variant="contained"
                color="secondary"
              >
                Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Ajouter
              </Button>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogColumn;
