import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseconfig-key/firebaseConfig";
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
// VERSION 1
  // const signIn = (e) => {
  //   e.preventDefault();
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then(() => {
  //       navigate('/');
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     });
  // };
  // const signIn = (e) => {
  //   e.preventDefault();
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then(async () => {
  //       const user = auth.currentUser;
  //       if (user) {
  //         const idTokenResult = await user.getIdTokenResult();
  //         if (idTokenResult.claims.admin) {
  //           // User is an admin, allow login
  //           navigate('/');
  //         } else {
  //           // User is not an admin, show error message
  //           setError("Only admin users can log in.");
  //         }
  //       } else {
  //         setError("User not found.");
  //       }
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     });
  // };
  // VERSION 2
  // const signIn = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { user } = await signInWithEmailAndPassword(auth, email, password);
  //     if (user) {
  //       const idTokenResult = await user.getIdTokenResult();
  //       if (idTokenResult.claims.admin) {
  //         // User is an admin, allow login
  //         navigate('/');
  //       } else {
  //         // User is not an admin, show error message
  //         setError("Only admin users can log in.");
  //         // You might also want to sign out the user in this case
  //         await auth.signOut();
  //       }
  //     } else {
  //       setError("User not found.");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };
  // VERSION 3 add evoke account
  // const signIn = async (e) => {
  //   e.preventDefault();
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then(async () => {
  //       const user = auth.currentUser;
  //       if (user) {
  //         const idTokenResult = await user.getIdTokenResult();
  //         if (idTokenResult.claims.admin) {
  //           // User is an admin, allow login
  //           setTimeout(() => {
  //             navigate('/');
  //           }, 500); // Delay for 500 milliseconds (adjust as needed)
  //         } else {
  //           // User is not an admin, show error message
  //           setError("Only admin users can log in.");
  //         }
  //       } else {
  //         setError("User not found.");
  //       }
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     });
  // };
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin) {
          // User is an admin, allow login
          navigate('/');
        } else {
          // User is not an admin, show error message
          setError("Only admin users can log in.");
          // You might also want to sign out the user in this case
          await auth.signOut();
        }
      } else {
        setError("User not found.");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  // version4 add smooth
  
  return (
    <div className="signin-container">
      <form onSubmit={signIn}>
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Signin;
