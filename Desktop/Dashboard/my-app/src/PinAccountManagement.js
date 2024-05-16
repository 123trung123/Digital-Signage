import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import { useHistory } from 'react-router-dom'; // Remove this line

const PinLogin = () => {
  const [pin, setPin] = useState('');
  // const history = useHistory(); // Remove this line
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, 'dummy@example.com', pin);
      // If login is successful, redirect to the dashboard or home page
      navigate('/'); // Use navigate instead of history.push
    } catch (error) {
      console.error('Error signing in with PIN:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <div>
      <h2>PIN Login</h2>
      <input
        type="password"
        placeholder="Enter your PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default PinLogin;
