import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Signin from './components/auth/Signin';
import Logs from './components/Logs';
import Upload from './components/Upload';
import AccountManagement from './AccountManagement';
import PlayerManagement from './PlayerManagement';
import PlayerHome from './components/PlayerHome';
import AdminHome from './components/AdminHome';
import { storage } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { get ,getDatabase, ref as dbRef, onValue, onDisconnect, set as setDB } from 'firebase/database';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 } from 'uuid';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import { signOut } from 'firebase/auth';


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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };
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
  const [navOpen, setNavOpen] = useState(false);
  
  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  // };
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');
  };
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };
  // const uploadFile = () => {
  //   if (!user) {
  //     console.log('User not authenticated');
  //     return;
  //   }

  //   if (imageUpload == null) return;

  //   const imageRef = storageRef(storage, `images/${imageUpload.name + v4()}`);

  //   uploadBytes(imageRef, imageUpload)
  //     .then((snapshot) => {
  //       getDownloadURL(snapshot.ref)
  //         .then((url) => {
  //           addDoc(pinsCollection, { imageUrl: url, userId: user.uid })
  //             .then(() => {
  //               // Update imageUrls state with the new URL
  //               setImageUrls((prevUrls) => [...prevUrls, url]);
  //             })
  //             .catch((error) => {
  //               console.error('Error adding document: ', error);
  //             });
  //         })
  //         .catch((error) => {
  //           console.error('Error getting download URL: ', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error uploading image: ', error);
  //     });
  // };
  const uploadFile = () => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }
  
    if (imageUpload == null) return;
    const imageId = v4();
    const imageRef = storageRef(storage, `images/${imageUpload.name + imageId}`);
  
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            // Add the document with imageUrl, userId, and isActive fields to Firestore
            addDoc(pinsCollection, { 
              imageUrl: url, 
              userId: "Store",
              isActive: true ,// Set the initial activation status to true
              Id:imageId
            })
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
  
  // // useEffect for user status and other machines' status
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
    
    const unsubscribeOtherMachines = onValue(dbRef(database, '/status'), (snapshot) => {
      const statusData = snapshot.val();
      setOtherMachineStatus(statusData || {});
    });
    
    // Subscribe to authentication state changes
    // const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    //   if (initialLoad) { // Check only on initial load
    //     setUser(user);
    //     setInitialLoad(false); // Set flag to false after first check
    //   }
    // });
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      console.log("User:", user); // Add this line to check if user is received
      setUser(user);
      setInitialLoad(false); // Set flag to false after first check
    });
    return () => {
      unsubscribeOtherMachines();
      unsubscribeAuth();
    };
  }, [user, initialLoad]); // Update on user change and initialLoad
// useEffect for user status and other machines' status
// useEffect(() => {
//   const setUserStatus = () => {
//     if (!user || !user.uid) return; // Check if user exists and has a UID

//     const presenceRef = dbRef(database, `.info/connected`);

//     onValue(presenceRef, (snapshot) => {
//       if (snapshot.val() === false) {
//         setIsOnline(false);
//         return;
//       }

//       setIsOnline(true);

//       const userStatusRef = dbRef(database, `/status/${user.uid}`);

//       const isOfflineForDatabase = { state: 'offline', last_changed: new Date().toString() };
//       const isOnlineForDatabase = { state: 'online', last_changed: new Date().toString() };
      
//       if (user && user.getIdTokenResult) {
//         user.getIdTokenResult().then((idTokenResult) => {
//           if (!idTokenResult.claims.admin) {
//             // If the user is not an admin, set status to offline
//             setDB(userStatusRef, isOfflineForDatabase);
//             onDisconnect(userStatusRef).set(isOfflineForDatabase);
//             setIsOnline(false);
//           } else {
//             // If the user is an admin, set status to online
//             setDB(userStatusRef, isOnlineForDatabase);
//             onDisconnect(userStatusRef).set(isOfflineForDatabase);
//             setIsOnline(true);
//           }
//         });
//       }
//     });
//   };
  
//   setUserStatus();
  
//   const unsubscribeOtherMachines = onValue(dbRef(database, '/status'), (snapshot) => {
//     const statusData = snapshot.val();
//     setOtherMachineStatus(statusData || {});
//   });
  
//   const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//     console.log("User:", user); // Add this line to check if user is received
//     setUser(user);
//     setInitialLoad(false); // Set flag to false after first check
//   });

//   return () => {
//     unsubscribeOtherMachines();
//     unsubscribeAuth();
//   };
// }, [user, initialLoad]);

  return (
    <BrowserRouter>
    <div className={isDarkMode ? 'app-container dark-mode' : 'app-container'}>

    
       
        <div className="nav">
            <div className="navButtons">
              <div className="top-bar">
                <span className="top-bar-title">Digital Signage System</span>
                
              </div>
              {!user && (
                <>
                  <Link to="/signin" className="navButton">Sign In</Link>
                </>
              )}
              {user && (
                <>
                  {/* <Link to="/" className="navButton">Home</Link> */}
                  <Link to="/Home" className="navButton">Dashboard</Link>
                  <Link to="/Access" className="navButton">Access</Link>
                  <Link to="/player" className="navButton">Player</Link>
                  <Link to="/account-management" className="navButton">AdminManager</Link>
                  
                </>
              )}
            </div>
            <Link onClick={toggleDarkMode} className="navToggleButton">Toggle Dark Mode</Link>
            <button onClick={handleLogout} className="Delete">Logout</button>
          </div>
       
        <div className="content">
          <Routes>
            
            <Route path="/signin" element={<Signin setUser={setUser} />} />
            {/* <Route path="/" element={<Home user={user} isOnline={isOnline} otherMachineStatus={otherMachineStatus} pins={pins} imageUrls={imageUrls} />} /> */}
            <Route path="/Home" element={<Logs pins={pins} imageUrls={imageUrls} imageUpload={imageUpload} otherMachineStatus={otherMachineStatus} setImageUpload={setImageUpload} uploadFile={uploadFile} />} />
            <Route path="/Access" element={<Upload pins={pins} imageUrls={imageUrls} imageUpload={imageUpload} otherMachineStatus={otherMachineStatus} setImageUpload={setImageUpload} uploadFile={uploadFile} uuid={v4()} />} />
            <Route path="/account-management/*" element={
              <>
                <AdminHome user={user} isOnline={isOnline} otherMachineStatus={otherMachineStatus} pins={pins} imageUrls={imageUrls} />
                <AccountManagement />
              </>
            } />
            <Route path="/player/*" element={
              <>
                <PlayerHome user={user} isOnline={isOnline} otherMachineStatus={otherMachineStatus} pins={pins} imageUrls={imageUrls} />
                <PlayerManagement />
              </>
            } />
          </Routes> 
        </div>
      </div>

    </BrowserRouter>
    
  );
};

export default App;