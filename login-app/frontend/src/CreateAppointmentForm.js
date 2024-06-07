import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Select, MenuItem, FormControl, InputLabel,
  TextField, Checkbox, FormGroup, FormControlLabel, CircularProgress, Grid
} from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from "react-router-dom";
import TimeSlots from './CreateAppointmentTimeSlots';

function CreateAppointmentForm() {
  const [appointmentDetails, setAppointmentDetails] = useState({
    type: '',
    doctorId: '',
    date: moment(),  // Use moment() for initialization
    time: moment(),
    specialRequirements: '',
    needsWheelchairAccess: false,
  });
  const [doctors, setDoctors] = useState([]); // This list will not be filtered dynamically
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/doctors')  // Ensure the URL matches your backend configuration
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      return response.json();
    })
    .then(data => {
      setDoctors(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Failed to load doctors');
      setLoading(false);
    });
}, []);

const handleChange = (event) => {
  const { name, value } = event.target;
  setAppointmentDetails(prev => ({
      ...prev,
      [name]: value,
  }));
};

const handleDateChange = (newValue) => {
  setAppointmentDetails(prev => ({
      ...prev,
      date: newValue,
  }));
};

const handleTimeChange = (newValue) => {
  setAppointmentDetails(prev => ({
      ...prev,
      time: newValue,
  }));
};

  const handleCheckboxChange = (event) => {
    setAppointmentDetails({ ...appointmentDetails, needsWheelchairAccess: event.target.checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(appointmentDetails);
    fetch('http://localhost:3001/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentDetails),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  const onNavigateBack = () => {
    history.goBack();
  };

  if (loading) return <CircularProgress />;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onNavigateBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h6" gutterBottom>
        Create New Appointment
      </Typography>
      <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
                                />
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Appointment Type</InputLabel>
          <Select
            name="type"
            value={appointmentDetails.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="OPD">OPD</MenuItem>
            {/* <MenuItem value="IPD">IPD</MenuItem>
            <MenuItem value="Surgery">Surgery</MenuItem>
            <MenuItem value="ICU">ICU</MenuItem>
            <MenuItem value="Emergency">Emergency</MenuItem>
            <MenuItem value="Follow-up">Follow-up</MenuItem>
            <MenuItem value="Telemedicine">Telemedicine</MenuItem>
            <MenuItem value="Diagnostic Test">Diagnostic Test</MenuItem> */}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Doctor</InputLabel>
          <Select
            name="doctorId"
            value={appointmentDetails.doctorId}
            onChange={handleChange}
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
       
         <FormControl fullWidth margin="normal">
          <DatePicker
            label="Date"
            value={appointmentDetails.date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} required />}
          />
        </FormControl>
{/*
        <FormControl fullWidth margin="normal">
          <TimePicker
            label="Time"
            value={appointmentDetails.time}
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} required />}
          />
        </FormControl> */}
         <div>
      <Typography variant="h6" gutterBottom>
        Available Time Slots
      </Typography>
      <div style={{ margin: 20 }}>
      <TimeSlots />
    </div>
    </div>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Special Requirements"
            name="specialRequirements"
            value={appointmentDetails.specialRequirements}
            onChange={handleChange}
            multiline
          />
        </FormControl>

        <FormGroup>
          <FormControlLabel control={<Checkbox checked={appointmentDetails.needsWheelchairAccess} onChange={handleCheckboxChange} />} label="Wheelchair Access Needed" />
        </FormGroup>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
          Book Appointment
        </Button>
      </form>
    </Container>
    </LocalizationProvider>
  );
}

export default CreateAppointmentForm;
