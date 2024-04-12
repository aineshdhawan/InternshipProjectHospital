import React, { useState } from "react";
import Login from "./Login";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import Registration from "./Registration";
import PatientDetails from './PatientDetails';
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";


function App() {


  const [user, setUser] = useState(null);

  const handleLoginSuccess = (token) => {

      setUser({ loggedIn: true });
  }


  return (
    <Router>
    <Switch>
      <Route path="/login" exact render={(props) => <Login {...props} onLogin={handleLoginSuccess} />} />
      <Route path="/register" component={Registration} />
  
      <ProtectedRoute path="/home" component={HomePage} user={user} />
      <Route path="/patients/:patientId" component={PatientDetails} />
      {/* redirect based on status */}
      <Route path="/" exact render={() => user ? <Redirect to="/home" /> : <Redirect to="/login" />} />
    </Switch>
  </Router>
  );
}


function getUserRole() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const { role } = jwtDecode(token);
  return role;
}



export default App;

//   const [user, setUser] = useState(null);

//   const handleLoginSuccess = (loginSuccessful) => {
//     if (loginSuccessful) {
//       // Login was successful
//       setUser({ loggedIn: true });
//     } else {
//       // login fail
//       setUser(null);

//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//   };

//   return (
//     <div>
//       {user ? (

//         <HomePage user={user} onLogout={handleLogout} />
//       ) : (

//         <Login onLogin={handleLoginSuccess} />
//       )}
//     </div>
//   );
// }
