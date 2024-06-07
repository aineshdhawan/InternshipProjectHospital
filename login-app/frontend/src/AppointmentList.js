import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Drawer,
  Toolbar,
  Box,
  Container,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

function AppointmentList() {
  const drawerWidth = 240;
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());

  const history = useHistory();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAppointments(date);
  };

  useEffect(() => {
    fetchAppointments(selectedDate); 
  }, []);

  const fetchAppointments = (date) => {
    const dateString = date.format("YYYY-MM-DD"); 
    fetch(`http://localhost:3001/appointments?date=${dateString}`)
      .then((response) => response.json())
      
      .then((data) => {
        console.log(data); 
        setAppointments(data);
      })
      .catch((error) => console.error("Error fetching appointments:", error));
  };

  const navigate = (path) => {
    history.push(path);
  };

  return (
    <div style={{ display: "flex" }}>
      <Container
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Box sx={{ pt: 8 }}>
          <h1>Appointments</h1>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Select a Date"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <List>
            {appointments.map((appointment) => (
              <ListItem key={appointment.appointment_id}>
                <ListItemText
                  primary={`Appointment with Dr. ${appointment.doctor_id} on ${appointment.date} at ${appointment.time_slot_start}` }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </div>
  );
}

export default AppointmentList;


