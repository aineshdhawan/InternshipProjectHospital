import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container } from '@mui/material';
import { DatePicker } from '@mui/lab'; // Assuming you're using MUI Lab for DatePicker

function CreateAppointmentForm() {
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientId: '',
    date: new Date(),
    timeSlot: '',
    department: '',
    doctorId: '',
  });

  const handleChange = (event) => {
    setAppointmentDetails({ ...appointmentDetails, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Submit logic here
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {/* Form fields like Select for patientId, department, etc. */}
        {/* Example for department field */}
        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            value={appointmentDetails.department}
            onChange={handleChange}
            name="department"
          >
            {/* Dynamically populate these options */}
            <MenuItem value="Orthopedic">Orthopedic</MenuItem>
            <MenuItem value="ENT">ENT</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit">Create Appointment</Button>
      </form>
    </Container>
  );
}

export default CreateAppointmentForm;
