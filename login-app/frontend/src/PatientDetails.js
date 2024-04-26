import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Typography, CircularProgress, Paper, List, ListItem, ListItemText, AppBar, Toolbar, Button, TextField, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

function PatientDetails({ patient }) {
  let history = useHistory();
  const { patientId } = useParams(); // Extract the patient ID from the URL
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true); // Enter edit mode
  };

const handleCancel = () => {
    setIsEditing(false); // Exit edit mode without saving
    // Optionally reset the form to initial values here
  };



const [patientDetails, setPatientDetails] = useState({
    name: '',
    contact_info: '',
    medical_history: '',
    // Add other details you want to be editable
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };



  const saveDetails = () => {
    fetch(`http://localhost:3001/patients/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientDetails),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
        // Optional: Show success message or navigate back
      })
      .catch((error) => {
        console.error('Error:', error);
        // Optional: Show error message
      });
      setIsEditing(false);
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/patients/${patientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }
        const data = await response.json();
        // Use setPatientDetails to update the state with fetched data
        setPatientDetails(data);
        console.log("Patient details set:", data);

      } catch (error) {
        console.error('Failed to fetch patient details:', error);
        setError('Failed to fetch patient details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatientDetails();
  }, [patientId]);
  

  // useEffect(() => {
  //   // Simulate fetching patient data from an API
  //   const fetchPatientDetails = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`http://localhost:3001/patients/${patientId}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch patient details');
  //       }
  //       const data = await response.json();
  //       setPatientDetails({
  //         name: data.name,
  //         phone: data.phone,
  //         medicalhistory: data.medical_history,
  //         // Populate other fields as necessary
  //       });
  //     } catch (error) {
  //       console.error('Failed to fetch patient details:', error);
  //       setError('Failed to fetch patient details. Please try again later.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
 //   fetchPatientDetails();
 //  }, [patientId]);


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

  if (!patientDetails || !patientDetails.id) {
    return <Typography>Could not find patient details.</Typography>;
  }

 
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
      {/* Box component to avoid overlap with content below AppBar */}
      
      <Box sx={{ pt: 8 }}>
        <Container>
          <Button startIcon={<ArrowBackIcon />} onClick={onNavigateBack} sx={{ my: 2 }}>
            Back
          </Button>
          <Typography variant="h4" gutterBottom>
            Patient Details
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <form noValidate autoComplete="off">
              {/* Changed the TextField components */}
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                value={patientDetails.name}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: !isEditing,
                  style: { borderBottom: isEditing ? '5px solid blue' : 'none' },
                }}
              />
              <TextField
                label="Contact Info"
                name="contact_info"
                fullWidth
                margin="normal"
                value={patientDetails.contact_info}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: !isEditing,
                  style: { borderBottom: isEditing ? '5px solid blue' : 'none' },
                }}
              />
              <TextField
                label="Medical History"
                name="medical_history"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={patientDetails.medical_history}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: !isEditing,
                  style: { borderBottom: isEditing ? '5px solid blue' : 'none' },
                }}
              />
              {isEditing ? (
                <>
                  <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={saveDetails} sx={{ mt: 2 }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button startIcon={<EditIcon />} variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
                  Edit
                </Button>
              )}
            </form>
          </Paper>
        </Container>
      </Box>
    </div>

    // <div>
    //   <AppBar position="fixed" >
    //      <Toolbar>
    //        <Typography variant="h6" sx={{ flexGrow: 1 }}>
    //          Hospital Dashboard
    //        </Typography>
    //        <Button color="inherit" onClick={onLogout} sx={{ position: 'absolute', right: 10 }}>
    //          Logout
    //        </Button>
    //      </Toolbar>
    //  </AppBar>
    //   <Container>
    //     <Button startIcon={<ArrowBackIcon />} onClick={onNavigateBack} sx={{ my: 2 }}>
    //       Back
    //     </Button>
    //     <Typography variant="h4" gutterBottom>
    //       Patient Details
    //     </Typography>
    //     <Paper elevation={3} sx={{ p: 2 }}>
    //       <form noValidate autoComplete="off">
    //         <TextField
    //           label="Name"
    //           name="name"
    //           fullWidth
    //           margin="normal"
    //           value={patientDetails.name}
    //           onChange={handleInputChange}
    //           disabled={!isEditing} // Make field editable only in edit mode
    //         />
    //          <TextField
    //           label="Contact Info"
    //           name="contact_info"
    //           fullWidth
    //           margin="normal"
    //           value={patientDetails.contact_info}
    //           onChange={handleInputChange}
    //           disabled={!isEditing}
    //         />
    //         <TextField
    //           label="Medical History"
    //           name="medical_history"
    //           fullWidth
    //           margin="normal"
    //           multiline
    //           rows={4}
    //           value={patientDetails.medical_history}
    //           onChange={handleInputChange}
    //           disabled={!isEditing}
    //         />
    //         {isEditing ? (
    //           <>
    //             <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={saveDetails} sx={{ mt: 2 }}>
    //               Save
    //             </Button>
    //             <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>
    //               Cancel
    //             </Button>
    //           </>
    //         ) : (
    //           <Button startIcon={<EditIcon />} variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
    //             Edit
    //           </Button>
    //         )}
    //       </form>
    //     </Paper>
    //   </Container>
    // </div>
  );
}

export default PatientDetails;
