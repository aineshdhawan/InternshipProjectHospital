import React from "react";
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";

function HomePage({ user }) {
  const drawerWidth = 240;
  let history = useHistory();

  const onLogout = () => {
    // Clear the token or user data from localStorage or your state management
    localStorage.removeItem("accessToken");

    // Redirect to the login page
    history.push("/login");
  };

  return (
    <div style={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hospital Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={onLogout}
            sx={{ position: "absolute", right: 10 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {["Dashboard", "Patients", "Appointments", "Settings"].map(
            (text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <main
        style={{
          flexGrow: 1,
          padding: "20px",
          marginTop: "64px",
          marginLeft: drawerWidth,
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* 4x1 Grid for live figures */}
            {["Figure 1", "Figure 2", "Figure 3", "Figure 4"].map((figure) => (
              <Grid item xs={12} sm={6} md={3} key={figure}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {figure}
                    </Typography>
                    <Typography>Placeholder data</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <footer className="footer">
          <Typography variant="body2" color="textSecondary" align="center">
            &copy; {new Date().getFullYear()} Hospital Name. All rights
            reserved.
          </Typography>
        </footer>
      </main>
    </div>
  );
}

export default HomePage;
