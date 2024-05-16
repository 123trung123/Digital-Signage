import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Make the newly created user admin
      await makeUserAdmin(userCredential.user.uid);

      // Add account to Firestore
      await addDoc(collection(firestore, 'accounts'), {
        uid: userCredential.user.uid,
        email: email,
        password: password,
        type: 'ADMIN' // Set the account type as 'ADMIN'
      });

      alert('Account created successfully!');
      setEmail('');
      setPassword('');
      fetchAccounts(); // Fetch accounts after creating a new one
    } catch (error) {
      setError(error.message);
      console.error('Error creating account:', error);
    }
  };

  // Function to make a user admin by setting custom claims
  const makeUserAdmin = async (uid) => {
    try {
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      console.log('User is now an admin');
    } catch (error) {
      console.error('Error setting custom claims:', error);
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

  const handleDeleteAccount = async (accountId, accountUid) => {
    try {
      await setDB(dbRef(database, `status/${accountUid}`), null);
      await deleteDoc(doc(firestore, 'accounts', accountId));
      fetchAccounts(); // Fetch accounts after deleting one
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
