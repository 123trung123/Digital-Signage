import React from 'react';
//import Signin from './components/auth/Signin';  // Assuming Signin is in auth folder
import Signin from  './auth/Signin'
const Login = ({ setUser }) => {
  return (
    <div>
      <Signin setUser={setUser} />
    </div>
  );
};

export default Login;