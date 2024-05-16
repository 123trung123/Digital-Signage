// AuthDetails.js
import React from 'react';
import { signOut } from './component/auth/authFunctions';

const AuthDetails = ({ user }) => {
  const handleSignOut = () => {
    signOut()
      .then(() => {
        // Sign-out successful.
        setUser(null); // Assuming you have access to setUser function
      })
      .catch((error) => {
        // An error occurred during sign-out.
        console.error('Sign-out error:', error);
      });
  };

  return (
    <div className="auth-details">
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
};

export default AuthDetails;
