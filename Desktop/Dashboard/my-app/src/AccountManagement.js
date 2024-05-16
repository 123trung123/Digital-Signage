// import React, { useState, useEffect } from 'react';
// import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword ,updateCurrentUser } from 'firebase/auth';
// import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { auth } from './firebaseConfig';
// import { ref as dbRef, set as setDB, getDatabase } from 'firebase/database'; // Import getDatabase

// const firestore = getFirestore();
// const database = getDatabase(); // Initialize the Realtime Database

// const AccountManagement = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accounts, setAccounts] = useState([]);
//   const [error, setError] = useState(null);

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       const originalUser = auth.currentUser; // Store the current user

//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // Restore the original user after creating a new account
//       await updateCurrentUser(auth, originalUser);
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
//       window.location.href = window.location.href;
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
//   }, []);

//   const handleDeleteAccount = async (accountId, accountUid) => {
//     try {
//       // Remove UID from the Realtime Database
      
//       await setDB(dbRef(database, `status/${accountUid}`), null);

//       // Delete account document from Firestore
//       await deleteDoc(doc(firestore, 'accounts', accountId));

//       // Find the account in the list by UI

//       fetchAccounts();
//     } catch (error) {
//       console.error('Error deleting account:', error);
//       setError('Error deleting account');
//     }
//   };

//   // Helper function to get user by UID
//   const getUserByUid = async (uid) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       return userCredential.user;
//     } catch (error) {
//       console.error('Error fetching user by UID:', error);
//       throw error;
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
//       <ul>
//         {accounts.map((account, index) => (
//           <li key={index}>
//             <div>
//               <p>Email: {account.email}</p>
//               <p>Password: {account.password}</p>
//               <p>UID: {account.uid}</p>
//             </div>
//             <button onClick={() => handleDeleteAccount(account.id, account.uid)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AccountManagement;
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateCurrentUser, deleteUser } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from './firebaseConfig';
import { ref as dbRef, set as setDB, getDatabase } from 'firebase/database';

const firestore = getFirestore();
const database = getDatabase();

const AccountManagement = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const originalUser = auth.currentUser;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateCurrentUser(auth, originalUser);
      await addDoc(collection(firestore, 'accounts'), {
        uid: userCredential.user.uid,
        email: email,
        password: password,
        type: 'ADMIN' 
      });

      const response = await fetch('http://localhost:5000/grantAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: userCredential.user.uid }),
      });

      if (response.ok) {
        console.log('Admin privileges granted successfully');
      } else {
        console.error('Error granting admin privileges:', response.statusText);
      }

      alert('Account created successfully!');
      setEmail('');
      setPassword('');
      window.location.href = window.location.href;
      fetchAccounts(); 
    } catch (error) {
      setError(error.message);
      console.error('Error creating account:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const accountsCollection = collection(firestore, 'accounts');
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsData = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const adminAccounts = accountsData.filter(account => account.type === 'ADMIN'); 
      setAccounts(adminAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Error fetching accounts');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDeleteAccount = async (accountId, accountUid) => {
    try {
      const originalUser = auth.currentUser;
      const originalToken = await originalUser.getIdToken(true);
      const userDocRef = doc(firestore, 'accounts', accountId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error("User does not exist.");
      }
      const { email, password } = userDoc.data();

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userToDelete = userCredential.user;

      await deleteUser(userToDelete);

      await deleteDoc(doc(firestore, 'accounts', accountId));

      await setDB(dbRef(database, `status/${accountUid}`), null);
      window.location.href = window.location.href;
      await updateCurrentUser(auth, originalUser);
      fetchAccounts(); 
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error deleting account');
    }
  };

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
              <p>Type: {account.type}</p> {/* Display the account type */}
            </div>
            <button onClick={() => handleDeleteAccount(account.id, account.uid)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountManagement;
