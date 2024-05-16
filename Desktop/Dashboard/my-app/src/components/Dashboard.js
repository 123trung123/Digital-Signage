// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import HomePage from './HomePage'; // Placeholder for HomePage component
import StatusPage from './StatusPage'; // Placeholder for StatusPage component
import LoginPage from './components/auth/Signin.js';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <Router>
      <Route exact path="/">
        {user ? <Redirect to="/status" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/status">
        {user ? <StatusPage /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login">
        <LoginPage setUser={setUser} />
      </Route>
    </Router>
  );
};

export default Dashboard;
