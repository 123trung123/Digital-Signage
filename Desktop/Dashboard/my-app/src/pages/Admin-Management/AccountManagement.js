import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateCurrentUser, deleteUser } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../firebaseconfig-key/firebaseConfig';
import { ref as dbRef, set as setDB, getDatabase } from 'firebase/database';
import '../../components/Style/Management.css';
const firestore = getFirestore();
const database = getDatabase();

const AccountManagement = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUid, setCurrentUid] = useState(null); 

  useEffect(() => {
    const fetchCurrentUserUid = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setCurrentUid(user.uid);
        }
      } catch (error) {
        console.error('Error fetching current user UID:', error);
      }
    };

    fetchCurrentUserUid();
  }, []);
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

      const response = await fetch('https://digital-signage-t3k0.onrender.com/grantAdmin', {
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

      setEmail('');
      setPassword('');
      setLoading(true);
      
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
      <form onSubmit={handleSignUp} className="signup-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
        </div>
        <button type="submit" className="btn-submit">Create Account</button>
      </form>
      {error && <p className="errorMessage">{error}</p>}
      {/* <button onClick={fetchAccounts} className="button">Fetch Accounts</button> */}
      <ul>
        {accounts.map((account, index) => (
            <li key={index} className="account-item" style={{  border: account.uid === currentUid ? '2px solid #ff9800' : 'none' }}>
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

export default AccountManagement;
