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
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import auth instance

const AccountManagement = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Account created successfully (use userCredential object)
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
      // Fetch accounts logic
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleFetchAccounts = () => {
    fetchAccounts();
  };

//   return (
//     <div  className="upload-container">
//       <h2>Account Management</h2>
//       <form onSubmit={handleSignUp}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Create Account</button>
//       </form>
//       {error && <p>{error}</p>}
//       <button onClick={handleFetchAccounts}>Fetch Accounts</button>
//       <ul>
//         {accounts.map((account, index) => (
//           <li key={index}>{account.email}</li>
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
    <button onClick={handleFetchAccounts} className="button">Fetch Accounts</button>
    <ul>
      {accounts.map((account, index) => (
        <li key={index}>{account.email}</li>
      ))}
    </ul>
  </div>
);
};

export default AccountManagement;
