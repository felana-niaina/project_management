import Header from "../Header/Header";
import { Box, Grid } from "@mui/material";
import MenuItem from "../MenuItem";

const Layout = (props: any) => {
  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        sm={2}
        md={2}
        lg={2}
        sx={{ height: "100vh", borderRight: "1px solid #ddd" }}
      >
        <MenuItem />
      </Grid>
      <Grid item xs={12} sm={10} md={10} lg={10}>
        <Box sx={{ height: "4.5rem" }}>
          <Header />
        </Box>
        <Box
          sx={{
            mt: "4.5rem",
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
