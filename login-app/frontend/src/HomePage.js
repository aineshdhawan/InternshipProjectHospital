import React, { useState } from "react";
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
import PatientSearch from "./PatientSearch";

function HomePage({ user }) {
  const drawerWidth = 240;

  const [searchResults, setSearchResults] = useState([]);
  let history = useHistory();

  const onLogout = () => {
    // Clear the token or user data from localStorage or your state management
    localStorage.removeItem("accessToken");
    history.push("/login");
  };

  const navigate = (path) => {
    history.push(path);
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
          {[
            { text: "Dashboard", url: "/" },
            { text: "Register New Patient", url: "/register" },
            { text: "Appointments", url: "/appointments" },
          ].map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.url)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        style={{
          flexGrow: 1,
          padding: "20px",
          marginTop: "64px",
          marginLeft: "15px",
        }}
      >
        
        <div>
          <PatientSearch onSearchResult={setSearchResults} />
          {
            searchResults.length > 0
            // &&
            // (
            // <div>
            //   <h2>Search Results</h2>
            //   {searchResults.map((patient) => (
            //     <div key={patient.id}>
            //       <p>{`ID: ${patient.id}, Name: ${patient.name}, Phone: ${patient.contact_info}`}</p>
            //     </div>
            //   ))}
            // </div>
            // )
          }
        </div>
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
