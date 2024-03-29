
import React, { useState } from "react";
import { FormControl } from '@mui/material';


import {
  Container,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { Link, useHistory  } from "react-router-dom";

function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    address: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhoneNumber: "",
  });

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Construct the payload
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactRelation: formData.emergencyContactRelation,
      emergencyContactPhoneNumber: formData.emergencyContactPhoneNumber,
    };

    // Use the fetch API to send a POST request to your backend
    fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Handle the response data
        history.push("/login"); // Redirect to the login page upon successful registration
      })
      .catch((error) => {
        console.error("There was an error registering the user:", error);
      });
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "20px" }}>
      <form>
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", textAlign: "center" }}
        >
          Register
        </Typography>
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />

        <TextField
          name="phoneNumber"
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <TextField
          name="dob"
          label="Date of Birth"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.dob}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

<FormControl component="fieldset" style={{ marginBottom: "20px", marginTop: "20px" }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>


        <TextField
          name="address"
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.address}
          onChange={handleChange}
        />

        <TextField
          name="emergencyContactName"
          label="Emergency Contact Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.emergencyContactName}
          onChange={handleChange}
        />

        <TextField
          name="emergencyContactRelation"
          label="Emergency Contact Relation"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.emergencyContactRelation}
          onChange={handleChange}
        />

        <TextField
          name="emergencyContactPhoneNumber"
          label="Emergency Contact Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.emergencyContactPhoneNumber}
          onChange={handleChange}
        />

        {/* <TextField label="Username" variant="outlined" fullWidth required margin="normal" />
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
        <TextField label="Emergency Contact Phone Number" variant="outlined" fullWidth required margin="normal" /> */}
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
