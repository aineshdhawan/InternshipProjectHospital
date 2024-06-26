import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';

function TimeSlots() {
  const [selectedTime, setSelectedTime] = useState('');

  // Static time slots for demonstration
  const timeSlots = ['09:00', '10:00', '11:00', '12:00'];

  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  const handleTimeChange = (slot) => {
    setAppointmentDetails(prev => ({
      ...prev,
      time: moment(slot, 'HH:mm'),
    }));
  };
  return (

    
    // <><Grid container spacing={2} sx={{ padding: 0.5 }}>

    //   {timeSlots.map((time, index) => (
    //     <Grid item key={index}>
    //       <Button
    //         variant={selectedTime === time ? 'contained' : 'outlined'}
    //         onClick={() => handleSelectTime(time)}
    //         color="primary"
    //       >
    //         {time}
    //       </Button>
    //     </Grid>
    //   ))}
    // </Grid>
    <div>
        <div style={{ margin: 20 }}>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => (
              <Button key={index} onClick={() => handleTimeChange(slot)}>
                {slot}
              </Button>
            ))
          ) : (
            <Typography>No available slots</Typography>
          )}
        </div>
      </div>
  );
}

export default TimeSlots;
