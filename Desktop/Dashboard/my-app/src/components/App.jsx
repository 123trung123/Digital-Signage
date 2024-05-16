import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link,Navigate } from 'react-router-dom';
import styles from './App.css'; // Import the CSS module
import Signin from './components/auth/Signin';
import Signup from './Signup';
import Home from './components/Home'; // Import the Home component
import Logs from './components/Logs'; // Import the Logs component
import Upload from './components/Upload'; // Import the Upload component
import AccountManagement from './AccountManagement'; // Import the new component
import { storage } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, push, onValue, onDisconnect, set as setDB } from 'firebase/database';
import { getFirestore, collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 } from 'uuid';
import { auth } from './firebaseConfig'; // Import auth instance
import { onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const firestore = getFirestore(app);
const setdatabase = dbRef(database, 'PIN');
const pinsCollection = collection(firestore, 'pins');

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [pins, setPins] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [otherMachineStatus, setOtherMachineStatus] = useState({});
  const [initialLoad, setInitialLoad] = useState(true); // New flag

  // Helper functions (moved to Upload component)

  // useEffect for fetching pins from Realtime Database
  useEffect(() => {
    const unsubscribeRealtimeDB = onValue(setdatabase, (snapshot) => {
      let pinArray = Object.values(snapshot.val() || {});
      setPins(pinArray);
    });

    return () => {
      unsubscribeRealtimeDB();
    };
  }, [setdatabase]);

  // useEffect for fetching image URLs from Firebase Storage
  useEffect(() => {
    const imagesListRef = storageRef(storage, 'images/');

    listAll(imagesListRef).then((response) => {
      const urls = response.items.map((item) => getDownloadURL(item));

      Promise.all(urls).then((downloadUrls) => {
        setImageUrls(downloadUrls);
      });
    });
  }, []);

  const uploadFile = () => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    if (imageUpload == null) return;

    const imageRef = storageRef(storage, `images/${imageUpload.name + v4()}`);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            addDoc(pinsCollection, { imageUrl: url, userId: user.uid })
              .then(() => {
                // Update imageUrls state with the new URL
                setImageUrls((prevUrls) => [...prevUrls, url]);
              })
              .catch((error) => {
                console.error('Error adding document: ', error);
              });
          })
          .catch((error) => {
            console.error('Error getting download URL: ', error);
          });
      })
      .catch((error) => {
        console.error('Error uploading image: ', error);
      });
  };

  // useEffect for user status and other machines' status
  useEffect(() => {
    const setUserStatus = () => {
      if (!user) return;

      const presenceRef = dbRef(database, `.info/connected`);

      onValue(presenceRef, (snapshot) => {
        if (snapshot.val() === false) {
          setIsOnline(false);
          return;
        }

        setIsOnline(true);

        const userStatusRef = dbRef(database, `/status/${user.uid}`);

        const isOfflineForDatabase = { state: 'offline', last_changed: new Date().toString() };
        const isOnlineForDatabase = { state: 'online', last_changed: new Date().toString() };
        
        setDB(userStatusRef, isOnlineForDatabase);
        
        onDisconnect(userStatusRef).set(isOfflineForDatabase);
              });
            };
        
            setUserStatus();
        
            // Subscribe to changes in other machines' statuses
            const unsubscribeOtherMachines = onValue(dbRef(database, '/status'), (snapshot) => {
              const statusData = snapshot.val();
              setOtherMachineStatus(statusData || {});
            });
        
            // Subscribe to authentication state changes
            const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
              if (initialLoad) { // Check only on initial load
                setUser(user);
                setInitialLoad(false); // Set flag to false after first check
              }
            });
        
            return () => {
              unsubscribeOtherMachines();
              unsubscribeAuth();
            };
          }, [user, initialLoad]); // Update on user change and initialLoad
        
          return (
            <BrowserRouter>
              <div className="app-container">
                <div className="nav">
                  <div className="navButtons">
                    <div className="top-bar">
                      <span className="top-bar-title">DASHBOARD</span>
                    </div>
                    <Link to="/" className="navButton">Home</Link>
                    <Link to="/logs" className="navButton">Logs</Link>
                    <Link to="/upload" className="navButton">Upload</Link>
                    {!user && ( // Conditionally render Signin/Signup links based on user state
                      <>
                        <Link to="/signup" className="navButton">Signup</Link>
                      </>
                    )}
                    {user ? ( // Conditionally render logout and account management links based on user state
                      <>
                        <Link to="/account-management" className="navButton">Account</Link>
                      </>
                    ) : (
                      <Navigate to="/signin" replace /> // Redirect to signin if not logged in
                    )}
                  </div>
                </div>
                <div className="content">
                  <Routes>
                    <Route path="/signin" element={<Signin setUser={setUser} />} />
                    <Route path="/" element={<Home user={user} isOnline={isOnline} otherMachineStatus={otherMachineStatus} pins={pins} imageUrls={imageUrls} />} />
                    <Route path="/logs" element={<Logs pins={pins} imageUrls={imageUrls} otherMachineStatus={otherMachineStatus} />} />
                    <Route path="/upload" element={<Upload imageUpload={imageUpload} setImageUpload={setImageUpload} uploadFile={uploadFile} />} />
                    <Route path="/account-management" element={<AccountManagement />} />
                  </Routes>
                </div>
              </div>
            </BrowserRouter>
          );
        };
        
        export default App;
        