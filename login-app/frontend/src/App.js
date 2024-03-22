import React, { useState } from "react";
import Login from "./Login";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import Registration from "./Registration";
import ProtectedRoute from "./ProtectedRoute";

// function App() {
  
//       // Optionally, redirect the user or fetch user data
//

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
      {/* Protect the /home route */}
      <ProtectedRoute path="/home" component={HomePage} user={user} />
      {/* Redirect based on authentication status */}
      <Route path="/" exact render={() => user ? <Redirect to="/home" /> : <Redirect to="/login" />} />
    </Switch>
  </Router>
  );
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
