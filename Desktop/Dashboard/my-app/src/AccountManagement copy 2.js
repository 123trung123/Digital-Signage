// import React, { useState, useEffect } from 'react';
// import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// const AccountManagement = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [newAccount, setNewAccount] = useState({});

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       const firestore = getFirestore();
//       const accountsCollection = collection(firestore, 'accounts');
//       const snapshot = await getDocs(accountsCollection);
//       const accountsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAccounts(accountsData);
//     };

//     fetchAccounts();
//   }, []);

//   const handleAddAccount = async () => {
//     const firestore = getFirestore();
//     const accountsCollection = collection(firestore, 'accounts');
//     const docRef = await addDoc(accountsCollection, newAccount);
//     setAccounts(prevAccounts => [...prevAccounts, { id: docRef.id, ...newAccount }]);
//     setNewAccount({});
//   };

//   const handleDeleteAccount = async (id) => {
//     const firestore = getFirestore();
//     const accountDoc = doc(firestore, 'accounts', id);
//     await deleteDoc(accountDoc);
//     setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewAccount(prevAccount => ({ ...prevAccount, [name]: value }));
//   };

//   return (
//     <div>
//       <h2>Account Management</h2>
//       <ul>
//         {accounts.map(account => (
//           <li key={account.id}>
//             {account.name} - {account.pin}
//             <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//       <form onSubmit={handleAddAccount}>
//         <input type="text" name="name" placeholder="Name" value={newAccount.name || ''} onChange={handleChange} />
//         <input type="text" name="pin" placeholder="PIN" value={newAccount.pin || ''} onChange={handleChange} />
//         <button type="submit">Add Account</button>
//       </form>
//     </div>
//   );
// };

// export default AccountManagement;
// import React, { useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from './firebaseConfig'; // Import auth instance

// const AccountManagement = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accounts, setAccounts] = useState([]);
//   const [error, setError] = useState(null);

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       // Account created successfully (use userCredential object)
//       alert('Account created successfully!');
//       setEmail('');
//       setPassword('');
//     } catch (error) {
//       // Handle errors
//       setError(error.message);
//       console.error('Error creating account:', error);
//     }
//   };

//   const fetchAccounts = async () => {
//     try {
//       // Fetch accounts logic
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//     }
//   };

//   const handleFetchAccounts = () => {
//     fetchAccounts();
//   };

// //   return (
// //     <div  className="upload-container">
// //       <h2>Account Management</h2>
// //       <form onSubmit={handleSignUp}>
// //         <div>
// //           <label>Email:</label>
// //           <input
// //             type="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div>
// //           <label>Password:</label>
// //           <input
// //             type="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <button type="submit">Create Account</button>
// //       </form>
// //       {error && <p>{error}</p>}
// //       <button onClick={handleFetchAccounts}>Fetch Accounts</button>
// //       <ul>
// //         {accounts.map((account, index) => (
// //           <li key={index}>{account.email}</li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default AccountManagement;

// return (
//   <div className="container">
//     <h2>Account Management</h2>
//     <form onSubmit={handleSignUp}>
//       <div>
//         <label>Email:</label>
//         <input
//           type="email"
//           className="input"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label>Password:</label>
//         <input
//           type="password"
//           className="input"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit" className="button">Create Account</button>
//     </form>
//     {error && <p className="errorMessage">{error}</p>}
//     <button onClick={handleFetchAccounts} className="button">Fetch Accounts</button>
//     <ul>
//       {accounts.map((account, index) => (
//         <li key={index}>{account.email}</li>
//       ))}
//     </ul>
//   </div>
// );
// };

// export default AccountManagement;









// import React, { useState, useEffect } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
// import { auth } from './firebaseConfig';

// const firestore = getFirestore();

// const AccountManagement = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accounts, setAccounts] = useState([]);
//   const [error, setError] = useState(null);

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       // Add account details to Firestore
//       await addDoc(collection(firestore, 'accounts'), {
//         email: email,
//         password: password
//       });
//       // Account created successfully
//       alert('Account created successfully!');
//       setEmail('');
//       setPassword('');
//     } catch (error) {
//       // Handle errors
//       setError(error.message);
//       console.error('Error creating account:', error);
//     }
//   };

//   const fetchAccounts = async () => {
//     try {
//       const accountsCollection = collection(firestore, 'accounts');
//       const accountsSnapshot = await getDocs(accountsCollection);
//       const accountsData = accountsSnapshot.docs.map(doc => doc.data());
//       setAccounts(accountsData);
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//       setError('Error fetching accounts');
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []); // Fetch accounts when component mounts

//   return (
//     <div className="container">
//       <h2>Account Management</h2>
//       <form onSubmit={handleSignUp}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             className="input"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             className="input"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="button">Create Account</button>
//       </form>
//       {error && <p className="errorMessage">{error}</p>}
//       <button onClick={fetchAccounts} className="button">Fetch Accounts</button>
//       <ul>
//         {accounts.map((account, index) => (
//           <li key={index}>
//             Email: {account.email}, Password: {account.password}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AccountManagement;




// import React, { useState, useEffect } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { auth } from './firebaseConfig';
// import { deleteUser } from "firebase/auth";
// import { ref as dbRef, set as setDB } from 'firebase/database';
// const firestore = getFirestore();
// const database = getDatabase();
// const AccountManagement = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accounts, setAccounts] = useState([]);
//   const [error, setError] = useState(null);

//   // const handleSignUp = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   //     // Add account details to Firestore
//   //     await addDoc(collection(firestore, 'accounts'), {
//   //       email: email,
//   //       password: password
//   //     });
//   //     // Account created successfully
//   //     alert('Account created successfully!');
//   //     setEmail('');
//   //     setPassword('');
//   //   } catch (error) {
//   //     // Handle errors
//   //     setError(error.message);
//   //     console.error('Error creating account:', error);
//   //   }
//   // };
//   // const handleSignUp = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   //     const { user } = userCredential;
//   //     // Add account details to Firestore along with UID
//   //     await addDoc(collection(firestore, 'accounts'), {
//   //       uid: user.uid, // Add UID
//   //       email: email,
//   //       password: password
//   //     });
//   //     // Account created successfully
//   //     alert('Account created successfully!');
//   //     setEmail('');
//   //     setPassword('');
//   //   } catch (error) {
//   //     // Handle errors
//   //     setError(error.message);
//   //     console.error('Error creating account:', error);
//   //   }
//   // };
//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       // Add account details to Firestore along with UID
//       await addDoc(collection(firestore, 'accounts'), {
//         uid: userCredential.user.uid, // Use userCredential to get UID
//         email: email,
//         password: password
//       });
//       // Account created successfully
//       alert('Account created successfully!');
//       setEmail('');
//       setPassword('');
//     } catch (error) {
//       // Handle errors
//       setError(error.message);
//       console.error('Error creating account:', error);
//     }
//   };
//   const fetchAccounts = async () => {
//     try {
//       const accountsCollection = collection(firestore, 'accounts');
//       const accountsSnapshot = await getDocs(accountsCollection);
//       const accountsData = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAccounts(accountsData);
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//       setError('Error fetching accounts');
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []); // Fetch accounts when component mounts

//   // const handleDeleteAccount = async (accountId) => {
//   //   try {
//   //     await deleteDoc(doc(firestore, 'accounts', accountId));
//   //     alert('Account deleted successfully!');
//   //     fetchAccounts(); // Refresh the accounts list
//   //   } catch (error) {
//   //     console.error('Error deleting account:', error);
//   //     setError('Error deleting account');
//   //   }
//   // };
//   // const handleDeleteAccount = async (accountId, accountUid) => {
//   //   try {
//   //     // Delete account from Firebase Authentication
//   //     await deleteUser(auth.currentUser);
  
//   //     // Delete account document from Firestore
//   //     await deleteDoc(doc(firestore, 'accounts', accountId));
  
//   //     // Remove UID from the Realtime Database
//   //     await setDB(dbRef(database, 'PIN', accountUid), null); // Assuming 'PIN' is the database path where UID is stored
  
//   //     alert('Account deleted successfully!');
//   //     fetchAccounts(); // Refresh the accounts list
//   //   } catch (error) {
//   //     console.error('Error deleting account:', error);
//   //     setError('Error deleting account');
//   //   }
//   // };
//   const handleDeleteAccount = async (accountId, accountUid) => {
//     try {
//       // Remove UID from the Realtime Database
//       await setDB(dbRef(database, 'status', accountUid), null);
  
//       // Delete account from Firebase Authentication
//       await deleteUser(auth.currentUser);
  
//       // Delete account document from Firestore
//       await deleteDoc(doc(firestore, 'accounts', accountId));
  
//       alert('Account deleted successfully!');
//       fetchAccounts(); // Refresh the accounts list
//     } catch (error) {
//       console.error('Error deleting account:', error);
//       setError('Error deleting account');
//     }
//   };
//   return (
//     <div className="container">
//       <h2>Account Management</h2>
//       <form onSubmit={handleSignUp}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             className="input"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             className="input"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="button">Create Account</button>
//       </form>
//       {error && <p className="errorMessage">{error}</p>}
//       <button onClick={fetchAccounts} className="button">Fetch Accounts</button>
//       {/* <ul>
//         {accounts.map((account, index) => (
//           <li key={index}>
//             Email: {account.email}, Password: {account.password}
//             <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
//           </li>
//         ))}
//       </ul> */}
//       <ul>
//   {accounts.map((account, index) => (
//     <li key={index}>
//       Email: {account.email}, Password: {account.password}, UID: {account.uid}
//       <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
//     </li>
//   ))}
// </ul>
//     </div>
//   );
// };

// export default AccountManagement;
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from './firebaseConfig';
import { deleteUser } from "firebase/auth";
import { ref as dbRef, set as setDB, getDatabase } from 'firebase/database'; // Import getDatabase
const firestore = getFirestore();
const database = getDatabase(); // Initialize the Realtime Database

const AccountManagement = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add account details to Firestore along with UID
      await addDoc(collection(firestore, 'accounts'), {
        uid: userCredential.user.uid, // Use userCredential to get UID
        email: email,
        password: password
      });
      // Account created successfully
      alert('Account created successfully!');
      setEmail('');
      setPassword('');
    } catch (error) {
      // Handle errors
      setError(error.message);
      console.error('Error creating account:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const accountsCollection = collection(firestore, 'accounts');
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsData = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Error fetching accounts');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // const handleDeleteAccount = async (accountId, accountUid) => {
  //   try {
  //     // Remove UID from the Realtime Database
  //     await setDB(dbRef(database, 'status', accountUid), null);
  
  //     // Delete account document from Firestore
  //     await deleteDoc(doc(firestore, 'accounts', accountId));
  
  //     alert('Account deleted successfully!');
  //     fetchAccounts();
  //   } catch (error) {
  //     console.error('Error deleting account:', error);
  //     setError('Error deleting account');
  //   }
  // };
  // const handleDeleteAccount = async (accountId, accountUid) => {
  //   try {
  //     // Remove UID from the Realtime Database
  //     await setDB(dbRef(database, `status/${accountUid}`), null);
    
  //     // Delete account document from Firestore
  //     await deleteDoc(doc(firestore, 'accounts', accountId));
    
  //     // Delete account from Firebase Authentication
  //     await deleteUser(auth.currentUser);
    
  //     alert('Account deleted successfully!');
  //     fetchAccounts();
  //   } catch (error) {
  //     console.error('Error deleting account:', error);
  //     setError('Error deleting account');
  //   }
  // };
  const handleDeleteAccount = async (accountId, accountUid) => {
    try {
      // Remove UID from the Realtime Database
      await setDB(dbRef(database, `status/${accountUid}`), null);
    
      // Delete account document from Firestore
      await deleteDoc(doc(firestore, 'accounts', accountId));
    
      // Find the account in the list by UID
      const accountToDelete = accounts.find(account => account.uid === accountUid);
    
      if (accountToDelete) {
        // Delete account from Firebase Authentication
        const user = await getUserByUid(accountUid);
        if (user) {
          await deleteUser(user);
          alert('Account deleted successfully!');
        } else {
          console.error('User not found with UID:', accountUid);
          setError('User not found');
        }
      } else {
        console.error('Account not found with UID:', accountUid);
        setError('Account not found');
      }
    
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error deleting account');
    }
  };
  
  // Helper function to get user by UID
  const getUserByUid = async (uid) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error fetching user by UID:', error);
      throw error;
    }
  };
  
//   return (
//     <div className="container">
//       <h2>Account Management</h2>
//       <form onSubmit={handleSignUp}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             className="input"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             className="input"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="button">Create Account</button>
//       </form>
//       {error && <p className="errorMessage">{error}</p>}
//       <button onClick={fetchAccounts} className="button">Fetch Accounts</button>
//       <ul>
//         {accounts.map((account, index) => (
//           <li key={index}>
//             Email: {account.email}, Password: {account.password}, UID: {account.uid}
//             <button onClick={() => handleDeleteAccount(account.id, account.uid)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AccountManagement;
return (
  <div className="container">
    <h2>Account Management</h2>
    <form onSubmit={handleSignUp}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="button">Create Account</button>
    </form>
    {error && <p className="errorMessage">{error}</p>}
    <button onClick={fetchAccounts} className="button">Fetch Accounts</button>
    <ul>
      {accounts.map((account, index) => (
        <li key={index}>
          <div>
            <p>Email: {account.email}</p>
            <p>Password: {account.password}</p>
            <p>UID: {account.uid}</p>
          </div>
          <button onClick={() => handleDeleteAccount(account.id, account.uid)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);
};
export default AccountManagement;