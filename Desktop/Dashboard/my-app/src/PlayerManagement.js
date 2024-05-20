import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, updateCurrentUser } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from './firebaseConfig';
import { ref as dbRef, set as setDB, getDatabase } from 'firebase/database';
import './components/Style/Management.css';
const firestore = getFirestore();
const database = getDatabase();

const PlayerManagement = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
        type: 'PLAYER' // Adding the TYPE field with value 'PLAYER'
      });

      alert('Account created successfully!');
      setEmail('');
      setPassword('');
      setLoading(true); 
      setTimeout(() => {
        window.location.href = window.location.href; 
      }, 500);
      fetchAccounts();
    } catch (error) {
      setError(error.message);
      console.error('Error creating account:', error);
    }
  };

  // const fetchAccounts = async () => {
  //   try {
  //     const accountsCollection = collection(firestore, 'accounts');
  //     const accountsSnapshot = await getDocs(accountsCollection);
  //     const accountsData = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setAccounts(accountsData);
  //   } catch (error) {
  //     console.error('Error fetching accounts:', error);
  //     setError('Error fetching accounts');
  //   }
  // };

  // useEffect(() => {
  //   fetchAccounts();
  // }, []);
  const fetchAccounts = async () => {
    try {
      const accountsCollection = collection(firestore, 'accounts');
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsData = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const playerAccounts = accountsData.filter(account => account.type === 'PLAYER');
      setAccounts(playerAccounts);
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
      <h2>Player Management</h2>
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
          <li key={index}className="account-item">
            <div>
              <p>Email: {account.email}</p>
              <p>Password: {account.password}</p>
              <p>UID: {account.uid}</p>
              <p>Type: {account.type}</p> 
            </div>
            <button className="delete-button" onClick={() => handleDeleteAccount(account.id, account.uid)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerManagement;
