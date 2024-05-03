import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


import {
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('');
  const [error, setError] = useState("");
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken); // Store the token
      onLogin(true); // Update the parent component or context provider
      history.push('/home');

    } catch (error) {
      console.error("Fetch error: " + error.message);
      setError("Incorrect Username or Password. Please try again.");
      onLogin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove the token
    onLogin(false); // Update the parent component or context provider
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hospital Name
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className="container">
        <Card className="card">
          <CardContent className="card-content">
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit} className="form">
              <TextField
                type="text"
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
              />
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />
              {/* <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value={'Doctor'}>Doctor</MenuItem>
                  <MenuItem value={'Reception Desk'}>Reception Desk</MenuItem>
                </Select>
              </FormControl> */}

              <Button
                sx={{ mt: 3, mb: 2 }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="submit-button"
              >
                Login
              </Button>
              {error && (
                <Typography variant="body2" className="error-message">
                  {error}
                </Typography>
              )}
              <Typography variant="body2" align="left" sx={{ mt: 2 }}>
                <Link href="#" onClick={handleLogout} underline="hover">
                  Forgot password?
                </Link>
              </Typography>
              {/* <Typography variant="body1">
                Don’t have an account? <Link to="/register">Register here</Link>
              </Typography> */}
            </form>
          </CardContent>
        </Card>
      </Container>
      <footer>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 4 }}
        >
          &copy; {new Date().getFullYear()} Hospital Name. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
}
export default Login;

