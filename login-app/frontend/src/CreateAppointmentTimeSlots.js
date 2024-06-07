import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';

function TimeSlots() {
  const [selectedTime, setSelectedTime] = useState('');

  // Static time slots for demonstration
  const timeSlots = ['09:00', '10:00', '11:00', '12:00'];

  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  return (
    <Grid container spacing={2} sx={{ padding: 0.5 }}>

      {timeSlots.map((time, index) => (
        <Grid item key={index}>
          <Button
            variant={selectedTime === time ? 'contained' : 'outlined'}
            onClick={() => handleSelectTime(time)}
            color="primary"
          >
            {time}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default TimeSlots;
