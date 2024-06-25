import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
// Components
import Signin from './components/auth/Signin';
import Logs from './pages/Home/Logs';
import Upload from './pages/Assets/Upload';
import AccountManagement from './pages/Admin-Management/AccountManagement';
import PlayerManagement from './pages/Player-Management/PlayerManagement';
import PlayerHome from './pages/Player-Management/PlayerHome';
import AdminHome from './pages/Admin-Management/AdminHome';
import Footer from './pages/Footer/Footer';
import SystemLogs from './pages/Logs/System';

// Firebase configuration and initialization
import firebaseConfig from './firebaseconfig-key/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, onValue, onDisconnect, set as setDB } from 'firebase/database';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { v4 } from 'uuid';

import { storage } from './firebaseconfig-key/firebaseConfig';
import { auth } from './firebaseconfig-key/firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const firestore = getFirestore(app);
const setdatabase = dbRef(database, 'PIN');
const pinsCollection = collection(firestore, 'pins');


const App = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [pins, setPins] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [otherMachineStatus, setOtherMachineStatus] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, toggleDropdown] = useState(false);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };
  useEffect(() => {
    const unsubscribeRealtimeDB = onValue(setdatabase, (snapshot) => {
      let pinArray = Object.values(snapshot.val() || {});
      setPins(pinArray);
    });

    return () => {
      unsubscribeRealtimeDB();
    };
  }, []);

  useEffect(() => {
    const imagesListRef = storageRef(storage, 'images/');

    listAll(imagesListRef).then((response) => {
      const urls = response.items.map((item) => getDownloadURL(item));

      Promise.all(urls).then((downloadUrls) => {
        setImageUrls(downloadUrls);
      });
    });
  }, []);

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

  const uploadFile = () => {
  
    if (imageUpload == null) return;
  
    const fileType = imageUpload.type.startsWith('image/') ? 'image' : 'video';
  
    const fileId = v4();
    const fileRef = storageRef(storage, `${fileType}s/${imageUpload.name + fileId}`);
  
    uploadBytes(fileRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            addDoc(pinsCollection, { 
              imageUrl: url, 
              userId: "Store",
              type: fileType, 
              isActive: true,
              Id: fileId,
              playMode: "alwaysOn",
              activationTime: null, 
              endTime: null 
            })
            .then(() => {
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
        console.error('Error uploading file: ', error);
      });
  };
  
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

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitialLoad(false); 
    });
    return () => {
      unsubscribeOtherMachines();
      unsubscribeAuth();
    };
  }, [user, initialLoad]); 
  return (
    <BrowserRouter>
    <div className={isDarkMode ? 'app-container dark-mode' : 'app-container'}>
    <div className="upper_bar">
    
    <span className="top-bar-title"><img src="../icon.png" alt="Icon" className="title-icon" /> DSS Signage</span>
        <button onClick={toggleDarkMode} className="navToggleButton">
          <img src={isDarkMode ? "../Sun.png" : "../Moon.png"} alt={isDarkMode ? "Sun Icon" : "Moon Icon"} className="toggle-icon" />
        </button>
          
          <div className="accountDropdown">
            {user && (
              <>
                <button onClick={toggleDropdown} className="accountButton">
                  <img src="../Icons/user.png" alt="Account Icon" className="accountIcon" />
                </button>
                {showDropdown && (
                  <div className="dropdownContent">
                    <p>{user.email}</p>
                    <button onClick={handleLogout} className="Delete">Logout</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

          <div className="nav">
            <div className="navButtons">
              {!user && (
                <>
                  <Link to="/signin" className="navButton">Sign In</Link>
                </>
              )}
              {user && (
                <>
                  <p className="nav-heading">GENERAL</p>
                  <NavLink to="/Home" className="navButton">
                    <img src="../Icons/analysis.png" alt="Home Icon" className="navIcon" /> Dashboard
                  </NavLink>
                  <p className="nav-heading2">MANAGEMENT</p>
                  <NavLink to="/Assets" className="navButton">
                    <img src="../Icons/image.png" alt="Assets Icon" className="navIcon" /> Asset
                  </NavLink>
                  <NavLink to="/player" className="navButton">
                    <img src="../Icons/video.png" alt="Player Icon" className="navIcon" /> Player
                  </NavLink>
                  <NavLink to="/account-management" className="navButton">
                    <img src="../Icons/user.png" alt="Admin Icon" className="navIcon" /> Admin
                  </NavLink>
                  <NavLink to="/system-logs" className="navButton">
                    <img src="../Icons/log.png" alt="System Logs Icon" className="navIcon" /> System Logs
                  </NavLink>
                </>
              )}
            </div>
          </div>
        <div className="content">
          <Routes>
            <Route path="/signin" element={<Signin setUser={setUser} />} />
            <Route path="/Home" element={<Logs pins={pins} imageUrls={imageUrls} imageUpload={imageUpload} otherMachineStatus={otherMachineStatus} setImageUpload={setImageUpload} uploadFile={uploadFile} />} />
            <Route path="/Assets" element={<Upload pins={pins} imageUrls={imageUrls} imageUpload={imageUpload} otherMachineStatus={otherMachineStatus} setImageUpload={setImageUpload} uploadFile={uploadFile} uuid={v4()} />} />
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
            <Route path="/system-logs" element={<SystemLogs otherMachineStatus={otherMachineStatus} />} /> {/* New Route for System Logs */}
          </Routes> 
        </div>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
