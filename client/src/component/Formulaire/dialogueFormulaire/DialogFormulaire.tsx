import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import { FC, useState, useEffect } from "react";
import { TFormulaire } from "../../../types/Formulaire";
import CircularProgress from "@mui/material/CircularProgress";
import { createUser, updateUser, deleteUser } from "../../../api/user-api";
import axios from "axios";
import configUrl from "../../../utils";

type TProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  mode: string;
  data: TFormulaire | any;
  trigger: () => void;
};

const DialogFormulaire: FC<TProps> = ({
  open,
  handleClose,
  title,
  mode,
  data,
  trigger,
}) => {
  const [newUser, setNewUser] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>([]);

  useEffect(() => {
    setNewUser({ ...data });
  }, [data]);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleChangeFile = (e: any) => {
    setSelectedFile([...selectedFile, e.target.files[0]]);
  };
  const getExtName = (FileName: string) => {
    const fileName = FileName.split(".");
    const size = fileName.length;

    return fileName[size - 1];
  };

  const getName = (FileName: string) => {
    const fileName = FileName.split(".");

    return fileName[0];
  };
  const uploadFile = async () => {
    const formData = new FormData();

    const getTypeFile: string = selectedFile[0].type;
    const extName = getExtName(selectedFile[0].name);
    const name = getName(selectedFile[0].name);

    const fileUploaded = new File([selectedFile[0]], `${name}.${extName}`, {
      type: getTypeFile,
    });

    formData.append("file", fileUploaded);
    const path = "profiles";

    const resultUploaded = await axios
      .post(`${configUrl.base_uri}/upload/${path}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err: any) => {
        console.log("error :::", err);
      });
    return resultUploaded;
  };
  console.log(selectedFile);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    let userSend = newUser;
    if (selectedFile.length > 0) {
      const fileUploaded: any = await uploadFile();
      userSend = {
        ...newUser,
        image: (fileUploaded.data.path as string)
          .replace("uploads\\", "")
          .replace("\\", "/"),
      };
    }
    mode === "create" ? await createUser(userSend) : await updateUser(userSend);
    trigger();
    closeDialog();

    setIsLoading(false);
  };

  const closeDialog = () => {
    setSelectedFile([]);
    handleClose();
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    await deleteUser(newUser._id);
    trigger();
    closeDialog();
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <CircularProgress />}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nom d'utilisateur"
                  required
                  value={newUser.username}
                  onChange={handleFormChange}
                  name="username"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Nom"
                  required
                  onChange={handleFormChange}
                  value={newUser.firstname}
                  name="firstname"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Prénom"
                  required
                  onChange={handleFormChange}
                  value={newUser.lastname}
                  name="lastname"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="E-mail"
                  required
                  onChange={handleFormChange}
                  value={newUser.email}
                  name="email"
                  fullWidth
                />
              </Grid>
              {mode === "create" && (
                <Grid item xs={12}>
                  <TextField
                    label="Mot de passe"
                    required
                    type="password"
                    onChange={handleFormChange}
                    value={newUser.password}
                    name="password"
                    fullWidth
                  />
                </Grid>
              )}
              <Grid>
                <input type="file" name="file" onChange={handleChangeFile} />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                >
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {mode === "create" ? "Create" : "update"}
                </Button>
                {mode === "edit" && (
                  <Button
                    onClick={handleDelete}
                    variant="contained"
                    color="inherit"
                  >
                    delete
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogFormulaire;
