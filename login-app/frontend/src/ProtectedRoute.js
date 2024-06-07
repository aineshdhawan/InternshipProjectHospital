// In ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('accessToken'); // Or implement your auth check

  return (
    <Route {...rest} render={props => (
      isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    )} />
  );
};

export default ProtectedRoute;
