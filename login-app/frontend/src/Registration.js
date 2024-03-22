import React from "react";
import { Container, TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, FormLabel } from "@mui/material";
import { Link } from "react-router-dom";

function Registration() {
  // You can set up state hooks here to manage the form input values and handle form submission.
  
  return (
    <Container maxWidth="xs" style={{ marginTop: "20px" }}>
      <form>
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", textAlign: "center" }}
        >
          Register
        </Typography>
        <TextField label="Username" variant="outlined" fullWidth required margin="normal" />
        <TextField label="Email" variant="outlined" fullWidth required margin="normal" type="email" />
        <TextField label="Password" variant="outlined" fullWidth required margin="normal" type="password" />
        <TextField label="Personal Phone Number" variant="outlined" fullWidth required margin="normal" />
        <TextField label="Date of Birth" variant="outlined" fullWidth required margin="normal" type="date" InputLabelProps={{ shrink: true }} />
        <FormLabel component="legend" style={{ marginTop: "20px" }}>Gender</FormLabel>
        <RadioGroup row aria-label="gender" name="gender">
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <TextField label="Address" variant="outlined" fullWidth required margin="normal" />
        <TextField label="Emergency Contact Name" variant="outlined" fullWidth required margin="normal" />
        <TextField label="Emergency Contact Relation" variant="outlined" fullWidth required margin="normal" />
        <TextField label="Emergency Contact Phone Number" variant="outlined" fullWidth required margin="normal" />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "30px", marginBottom: "20px" }}
        >
          Register
        </Button>
        <Typography variant="body1" style={{ textAlign: "center" }}>
          Already registered? <Link to="/login">Sign in</Link>
        </Typography>
      </form>
    </Container>
  );
}

export default Registration;
