import React, { useState } from 'react';
import Login from './Login'; 
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage'; 

// function App() {
//   const [user, setUser] = useState(null);

//   const handleLoginSuccess = (token) => {
    
//       setUser({ loggedIn: true });
      
//       // Optionally, redirect the user or fetch user data
//   };


function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loginSuccessful) => {
    if (loginSuccessful) {
      // Login was successful
      setUser({ loggedIn: true });
    } else {
      // login fail
      setUser(null);

    }
  };



  const handleLogout = () => {
    setUser(null); 
  };

  // return (
  //   <Router>
  //     <div>
  //       <Switch>
  //         <Route path="/login">
  //           <Login />
  //         </Route>
  //         <Route path="/register">
  //           <Registration />
  //         </Route>
  //         <Route path="/home">
  //           <HomePage />
  //         </Route>
  //         <Route path="/">
  //           <Login /> 
  //         </Route>
  //       </Switch>
  //     </div>
  //   </Router>
  // );
  return (
    <div>
      {user ? (

        <HomePage user={user} onLogout={handleLogout} />
      ) : (

        <Login onLogin={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
