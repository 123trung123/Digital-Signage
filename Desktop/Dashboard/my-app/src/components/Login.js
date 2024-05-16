import React from 'react';
import Signin from  './auth/Signin'
const Login = ({ setUser }) => {
  return (
    <div>
      <Signin setUser={setUser} />
    </div>
  );
};

export default Login;