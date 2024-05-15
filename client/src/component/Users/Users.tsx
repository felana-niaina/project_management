import { Button, Grid, TextField } from "@material-ui/core";
import { registerUser } from "../../api/user-api";
import { useState } from "react";
import axios from "axios";
import configUrl from "../../utils";
import { TFormulaire } from "../../types/Formulaire";
import useStyles from "./styles";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
const Users = () => {
  const defaultUser: TFormulaire = {
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    image: "",
    password: "",
    idProject: "",
  };

  const classes = useStyles();
  const [newUser, setNewUser] = useState(defaultUser);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [profilePicture, setProfilePicture] = useState("default-profile.jpg");
  const history = useNavigate();
  const underlineStyle = {
    borderBottom: "2px solid 	#6495ED", // Remplacez 'red' par la couleur de l'underline souhaitée
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleChangeFile = (e: any) => {
    setSelectedFile([...selectedFile, e.target.files[0]]);

    const newFile = e.target.files[0];

    if (newFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        setProfilePicture(e.target.result);
      };

      reader.readAsDataURL(new Blob([newFile]));
      setSelectedFile([newFile]);
    }
  };
  console.log(selectedFile);
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
  const toConnect = () => {
    history("/");
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
    const registerUsers = await registerUser(userSend);
    // const updateId = await updateUser({ ...createdUser?.data });
    if (registerUsers) {
      history("/");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.contentContainer}>
        <Grid
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            paddingTop: "1rem",
            color: "#002f5d",
            fontFamily: "Georgia",
          }}
        >
          <h1>Welcome !</h1>
          <h3>Please register your identity.</h3>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid style={{ margin: "auto" }}>
                <Avatar
                  alt="Profile Picture"
                  src={profilePicture}
                  sx={{ width: 130, height: 130 }}
                />
                <div className={classes.uploadButton}>
                  <input
                    type="file"
                    name="test"
                    onChange={handleChangeFile}
                    style={{ position: "absolute" }}
                  />
                </div>
              </Grid>

              <Grid item xs={12} style={{ display: "flex" }}>
                <TextField
                  label="Nom"
                  required
                  onChange={handleFormChange}
                  value={newUser.firstname}
                  name="firstname"
                  style={{
                    width: "90%",
                    marginLeft: "2rem",
                  }}
                  className={classes.textfield}
                />

                <TextField
                  label="Prénom"
                  required
                  onChange={handleFormChange}
                  value={newUser.lastname}
                  name="lastname"
                  style={{
                    width: "90%",
                    marginLeft: "2rem",
                    marginRight: "1rem",
                  }}
                  className={classes.textfield}
                />
              </Grid>

              <Grid item xs={12} style={{ display: "flex" }}>
                <TextField
                  label="Nom d'utilisateur"
                  required
                  value={newUser.username}
                  onChange={handleFormChange}
                  name="username"
                  style={{
                    width: "90%",
                    marginLeft: "2rem",
                  }}
                  className={classes.textfield}
                />
                <TextField
                  label="E-mail"
                  required
                  onChange={handleFormChange}
                  value={newUser.email}
                  name="email"
                  style={{
                    width: "90%",
                    marginLeft: "2rem",
                    marginRight: "1rem",
                  }}
                  className={classes.textfield}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Mot de passe"
                  required
                  type="password"
                  onChange={handleFormChange}
                  value={newUser.password}
                  name="password"
                  style={{
                    width: "90%",
                    marginLeft: "2rem",
                  }}
                  className={classes.textfield}
                />
              </Grid>
              <Grid
                item
                xs={12}
                style={{ textAlign: "right", marginRight: "2rem" }}
              >
                <a href="#" onClick={toConnect} style={{ color: "#002f5d" }}>
                  Already have an account?
                </a>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  textAlign: "center",
                  paddingTop: "2rem",
                  paddingBottom: "1.5rem",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    height: "50px",
                    width: "50%",
                    backgroundColor: "#002f5d",
                    color: "#fff",
                    borderRadius: 0,
                  }}
                >
                  Continuer
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </div>
    </div>
  );
};

export default Users;
