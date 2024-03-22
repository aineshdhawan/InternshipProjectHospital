import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Link,
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
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken); // Store the token
      onLogin(true); // Update the parent component or context provider
    } catch (error) {
      console.error("Fetch error: " + error.message);
      setError("Login failed. Please try again.");
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
              <Typography variant="body1">
                Don't have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  underline="hover"
                >
                  Register here
                </Link>
              </Typography>
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

// import React, { useState } from 'react';
// import { TextField, Button, Typography, Link, AppBar, Toolbar, Container, Card, CardContent } from '@mui/material';
// import './Login.css';

// function Login({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:3001/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//         credentials: 'include',
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const { accessToken } = await response.json();
//       localStorage.setItem('accessToken', accessToken); // Store the token
//       onLogin(true); // Update the parent component or context provider
//     } catch (error) {
//       console.error("Fetch error: " + error.message);
//       setError("Login failed. Please try again.");
//       onLogin(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken'); // Remove the token
//     onLogin(false); // Update the parent component or context provider
//   };

//   return (
//     <div>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             Hospital Name
//           </Typography>
//           <Button color="inherit" onClick={handleLogout}>Logout</Button>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth="md" className="container">
//         <Card className="card">
//           <CardContent className="card-content">
//             <Typography variant="h5" align="center" gutterBottom>Login</Typography>
//             <form onSubmit={handleSubmit} className="form">
//               <TextField
//                 type="text"
//                 label="Username"
//                 variant="outlined"
//                 fullWidth
//                 value={username}
//                 onChange={e => setUsername(e.target.value)}
//                 margin="normal"
//               />
//               <TextField
//                 type="password"
//                 label="Password"
//                 variant="outlined"
//                 fullWidth
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 margin="normal"
//               />
//               <Button sx={{ mt: 3, mb: 2 }} type="submit" variant="contained" color="primary" fullWidth className="submit-button">
//                 Login
//               </Button>
//               {error && <Typography variant="body2" className="error-message">{error}</Typography>}
//               <Typography variant="body2" align="left" sx={{ mt: 2 }}>
//                 <Link href="#" onClick={handleLogout} underline="hover">
//                   Forgot password?
//                 </Link>
//               </Typography>
//               <Typography variant="body2" align="left" sx={{ mt: 2 }}>
//                 Don't have an account? 
//                 <Link href="#" onClick={handleLogout} underline="hover">
//                   Sign up here
//                 </Link>
//               </Typography>
//             </form>
//           </CardContent>
//         </Card>
//       </Container>
//       <footer>
//       <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
//           &copy; {new Date().getFullYear()} Hospital Name. All rights reserved.
//         </Typography>
//       </footer>
//     </div>
//   );
// }
// export default Login;

// import React from 'react';
// import {AppBar, Toolbar, Container, TextField, Button, Typography, Link, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio} from '@mui/material';

// function Registration() {
//   return (
//     <Container maxWidth="xs" style={{ marginTop: '20px', paddingTop: '60px' }}> {/* Adjusted padding to account for AppBar */}
//       <form>
//         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//           <Toolbar>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//               Hospital Dashboard
//             </Typography>
//             <Button color="inherit" sx={{ position: 'absolute', right: 10 }}>
//               Logout
//             </Button>
//           </Toolbar>
//         </AppBar>
//         <Typography variant="h5" style={{ marginBottom: '20px', textAlign: 'center' }}>
//           Register
//         </Typography>
//         <TextField label="Username" variant="outlined" fullWidth required margin="normal" />
//         <TextField label="Email" variant="outlined" fullWidth required margin="normal" type="email" />
//         <TextField label="Password" variant="outlined" fullWidth required margin="normal" type="password" />
//         <TextField label="Personal Phone Number" variant="outlined" fullWidth required margin="normal" />
//         <TextField label="Date of Birth" variant="outlined" fullWidth required margin="normal" type="date" InputLabelProps={{ shrink: true }} />
        
//         {/* Gender Radio Buttons */}
//         <FormControl component="fieldset" margin="normal" fullWidth>
//           <FormLabel component="legend">Gender</FormLabel>
//           <RadioGroup row>
//             <FormControlLabel value="female" control={<Radio />} label="Female" />
//             <FormControlLabel value="male" control={<Radio />} label="Male" />
//             <FormControlLabel value="other" control={<Radio />} label="Other" />
//           </RadioGroup>
//         </FormControl>
        
//         <TextField label="Address" variant="outlined" fullWidth required margin="normal" multiline />
//         <TextField label="Emergency Contact Name" variant="outlined" fullWidth required margin="normal" />
//         <TextField label="Emergency Contact Relation" variant="outlined" fullWidth required margin="normal" />
//         <TextField label="Emergency Contact Phone Number" variant="outlined" fullWidth required margin="normal" />
//         <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
//           Register
//         </Button>
//         <Typography variant="body1" style={{ textAlign: 'center' }}>
//           Already registered?{' '}
//           <Link href="/login" underline="hover">
//             Sign in
//           </Link>
//         </Typography>
//       </form>
//       <footer>
//       <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
//          &copy; {new Date().getFullYear()} Hospital Name. All rights reserved.
//        </Typography>
//        </footer>
//     </Container>
   
//   );
// }

// export default Registration;
