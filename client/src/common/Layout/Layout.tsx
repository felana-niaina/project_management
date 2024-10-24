import Header from "../Header/Header";
import { Box, Grid } from "@mui/material";
import SideBar from "../SideBar";

const Layout = (props: any) => {
  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={2}
        sm={2}
        md={2}
        lg={2}
        sx={{ height: "100vh", borderRight: "1px solid #ddd" }}
      >
        <SideBar />
      </Grid>
      <Grid item xs={10} sm={10} md={10} lg={10}>
        <Box>
          <Header />
        </Box>
        <Box
          sx={{
            height: "calc(100vh - 4.5rem)",
            overflow: "auto",
          }}
        >
          {props.children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Layout;
