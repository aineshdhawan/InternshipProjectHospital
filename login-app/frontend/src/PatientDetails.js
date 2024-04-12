import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Typography, CircularProgress, Paper, List, ListItem, ListItemText, AppBar, Toolbar, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PatientDetails() {
  let history = useHistory();
  const { patientId } = useParams(); // Extract the patient ID from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching patient data from an API
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/patients/${patientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error('Failed to fetch patient details:', error);
        setError('Failed to fetch patient details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

  

    fetchPatientDetails();
  }, [patientId]);


  const onNavigateBack = () => {
    history.goBack(); // Navigate back to the previous page
  };

  const onLogout = () => {
    // Clear the token or user data from localStorage or your state management
    localStorage.removeItem("accessToken");

    // Redirect to the login page
    history.push("/login");
  };



  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!patient) {
    return <Typography>Could not find patient details.</Typography>;
  }

  // Display patient details
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hospital Dashboard
          </Typography>
          <Button color="inherit" onClick={onLogout} sx={{ position: 'absolute', right: 10 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {/* Use a Toolbar here to add spacing equivalent to the AppBar's height */}
      <Toolbar />
      <Container>
        {/* Adding a back button for better navigation */}
        <Button startIcon={<ArrowBackIcon />} onClick={onNavigateBack} sx={{ my: 2 }}>
          Back
        </Button>
        <Typography variant="h4" gutterBottom>
          Patient Details
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            <ListItem>
              <ListItemText primary="Name" secondary={patient.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Contact Info" secondary={patient.contact_info} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Medical History" secondary={patient.medical_history} />
            </ListItem>
          </List>
        </Paper>
      </Container>
    </div>
  );
}

export default PatientDetails;
