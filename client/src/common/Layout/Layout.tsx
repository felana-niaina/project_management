import Header from "../Header/Header";
import { Grid } from "@mui/material";
import MenuItem from "../MenuItem";

const Layout = (props: any) => {
  return (
    <div>
      <Header />
      <Grid container sx={{ mt: "4rem" }}>
        <Grid item xs={12} sm={2} md={2} lg={2}>
          <MenuItem />
        </Grid>
        <Grid item xs={12} sm={10} md={10} lg={10}>
          <div>{props.children}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Layout;
