import React from 'react';
import { Container, Button,AppBar, Toolbar, Typography, List, ListItem, ListItemText, TextField, Drawer  } from '@mui/material';
import { useHistory } from 'react-router-dom';
import AppointmentList from './AppointmentList';
import DoctorSelector from './DoctorSelector'; // Adjust the path as necessary based on your project structure


function AppointmentsPage() {
    const drawerWidth = 240;
  let history = useHistory();

  const navigateToCreateAppointment = () => {
    history.push("/create-appointment");
  };


  const onLogout = () => {
    // Clear the token or user data from localStorage or your state management
    localStorage.removeItem("accessToken");
    history.push("/login");
  };

  const navigate = (path) => {
    history.push(path);
  };
  
  return (
    <div>
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

   <Container sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
      <h1>Appointments Dashboard</h1>
      <Button variant="contained" color="primary" onClick={navigateToCreateAppointment}>
        Create New Appointment
      </Button>
      <DoctorSelector />
    </Container></div>
  );
}

export default AppointmentsPage;
