import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography } from '@mui/material';
import { DatePicker } from '@mui/lab'; // Ensure MUI Lab is installed and imported for DatePicker
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory  } from "react-router-dom";


function CreateAppointmentForm() {
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientId: '',
    date: new Date(),
    timeSlot: '',
    department: '',
    doctorId: '',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAppointmentDetails({ ...appointmentDetails, [name]: value });
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    // Submit logic here
    console.log(appointmentDetails);
    // Assume an endpoint 'http://localhost:3001/appointments' exists to handle this POST request
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
    history.goBack(); // Navigate back to the previous page
  };
  const history = useHistory();


  return (
    
    // <Container>
    //    <Button startIcon={<ArrowBackIcon />} onClick={onNavigateBack} sx={{ my: 2 }}>
    //         Back
    //       </Button>
    //   <form onSubmit={handleSubmit}>
    //     <FormControl fullWidth margin="normal">
    //       <InputLabel>Patient ID</InputLabel>
    //       <TextField
    //         name="patientId"
    //         value={appointmentDetails.patientId}
    //         onChange={handleChange}
    //         required
    //       />
    //     </FormControl>

    //     <FormControl fullWidth margin="normal">
    //       <DatePicker
    //         label="Date"
    //         value={appointmentDetails.date}
    //         onChange={(newValue) => {
    //           setAppointmentDetails({ ...appointmentDetails, date: newValue });
    //         }}
    //         renderInput={(params) => <TextField {...params} />}
    //       />
    //     </FormControl>

    //     <FormControl fullWidth margin="normal">
    //       <InputLabel>Time Slot</InputLabel>
    //       <Select
    //         name="timeSlot"
    //         value={appointmentDetails.timeSlot}
    //         onChange={handleChange}
    //         required
    //       >
    //         <MenuItem value="Morning">Morning</MenuItem>
    //         <MenuItem value="Evening">Evening</MenuItem>
    //       </Select>
    //     </FormControl>

    //     <FormControl fullWidth margin="normal">
    //       <InputLabel>Department</InputLabel>
    //       <Select
    //         name="department"
    //         value={appointmentDetails.department}
    //         onChange={handleChange}
    //         required
    //       >
    //         <MenuItem value="Orthopedic">Orthopedic</MenuItem>
    //         <MenuItem value="ENT">ENT</MenuItem>
    //         {/* Add more departments as necessary */}
    //       </Select>
    //     </FormControl>

    //     <FormControl fullWidth margin="normal">
    //       <InputLabel>Doctor ID</InputLabel>
    //       <TextField
    //         name="doctorId"
    //         value={appointmentDetails.doctorId}
    //         onChange={handleChange}
    //         required
    //       />
    //     </FormControl>

    //     <Button type="submit" variant="contained" color="primary">
    //       Create Appointment
    //     </Button>
    //   </form>
    // </Container>
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onNavigateBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h6" gutterBottom>
        Create New Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="patient-id">Patient ID</InputLabel>
          <TextField
            id="patient-id"
            name="patientId"
            value={appointmentDetails.patientId}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <DatePicker
            label="Date"
            value={appointmentDetails.date}
            onChange={(newValue) => {
              setAppointmentDetails({ ...appointmentDetails, date: newValue });
            }}
            renderInput={(params) => <TextField {...params} required />}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="time-slot">Time Slot</InputLabel>
          <Select
            id="time-slot"
            name="timeSlot"
            value={appointmentDetails.timeSlot}
            onChange={handleChange}
            required
          >
            <MenuItem value="morning">Morning</MenuItem>
            <MenuItem value="evening">Evening</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="department">Department</InputLabel>
          <Select
            id="department"
            name="department"
            value={appointmentDetails.department}
            onChange={handleChange}
            required
          >
            <MenuItem value="Orthopedic">Orthopedic</MenuItem>
            <MenuItem value="ENT">ENT</MenuItem>
            </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="doctor-id">Doctor ID</InputLabel>
          <TextField
            id="doctor-id"
            name="doctorId"
            value={appointmentDetails.doctorId}
            onChange={handleChange}
            required
          />
        </FormControl>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
          Create Appointment
        </Button>
      </form>
    </Container>
  );
}

export default CreateAppointmentForm;
