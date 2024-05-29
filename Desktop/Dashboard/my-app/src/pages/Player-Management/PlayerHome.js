import React, { useState, useEffect, useRef } from 'react';
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, updateCurrentUser } from 'firebase/auth';
import { collection, query, onSnapshot, getFirestore, doc, updateDoc, getDocs, where, deleteDoc, getDoc } from 'firebase/firestore';
import { auth } from '../../firebaseconfig-key/firebaseConfig';
import { ref as dbRef, set as setDB, getDatabase } from 'firebase/database';
import '../../components/Style/PlayerHome.css';

const firestore = getFirestore();
const database = getDatabase();

const PlayerHome = ({ isOnline, otherMachineStatus }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [timeFrameModalOpen, setTimeFrameModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false); 
  const [infoContent, setInfoContent] = useState(null); 
  const [infoDropdownPosition, setInfoDropdownPosition] = useState({ top: 0, left: 0 });
  const [machineIds, setMachineIds] = useState([]);
  const [machineImages, setMachineImages] = useState({});
  const [storeImages, setStoreImages] = useState([]);
  const [machineIsOpen, setMachineIsOpen] = useState({});
  const [zoomedMachine, setZoomedMachine] = useState(null);
  const [timeFrame, setTimeFrame] = useState({ startTime: '', endTime: '' });
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const toggleMachineBox = (machineId) => {
    setMachineIsOpen({ ...machineIsOpen, [machineId]: !machineIsOpen[machineId] });
  };

  const toggleZoom = (machineId) => {
    setZoomedMachine(zoomedMachine === machineId ? null : machineId);
  };

  const getStatusIcon = (status) => {
    return status === 'online' ? '🟢' : '🔴';
  };

  const getStatusLabel = (status) => {
    return status === 'online' ? 'Online' : 'Offline';
  };

  useEffect(() => {
    const fetchMachineIds = async () => {
      try {
        const accountsRef = collection(firestore, 'accounts');
        const q = query(accountsRef, where('type', '==', 'PLAYER'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const uniqueMachineIds = new Set();
          querySnapshot.forEach(doc => uniqueMachineIds.add(doc.data().uid));
          setMachineIds(Array.from(uniqueMachineIds));
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching machine IDs:', error);
      }
    };

    fetchMachineIds();
  }, []);

  useEffect(() => {
    const groupImagesByMachineId = () => {
      const pinsRef = collection(firestore, 'pins');
      const q = query(pinsRef);
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const groupedImages = {};
        machineIds.forEach(machineId => {
          groupedImages[machineId] = [];
        });

        querySnapshot.forEach(doc => {
          const { userId, imageUrl, isActive, type } = doc.data();
          if (groupedImages[userId]) {
            groupedImages[userId].push({ id: doc.id, imageUrl, isActive, type });
          }
        });
        setMachineImages(groupedImages);
      });
      return unsubscribe;
    };
    groupImagesByMachineId();
  }, [machineIds]);

  useEffect(() => {
    const fetchStoreImages = async () => {
      try {
        const storeRef = collection(firestore, 'pins');
        const q = query(storeRef, where('userId', '==', 'Store'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const images = [];
          querySnapshot.forEach(doc => {
            const { imageUrl, isActive } = doc.data();
            images.push({ id: doc.id, imageUrl, isActive, type: doc.data().type });
          });
          setStoreImages(images);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching store images:', error);
      }
    };
    fetchStoreImages();
  }, []);

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

  const handleImageSelect = (imageUrl, docId) => {
    setSelectedImage({ imageUrl, docId });
    setConfirmModalOpen(true);
  };

  const confirmUIDChange = async (newMachineId) => {
    try {
      const docRef = doc(firestore, 'pins', selectedImage.docId);
      await updateDoc(docRef, { userId: newMachineId });
      console.log('UID updated successfully.');
    } catch (error) {
      console.error('Error updating UID:', error);
    } finally {
      setConfirmModalOpen(false);
    }
  };

  const handleCheckboxClick = (e, docId, currentStatus) => {
    e.stopPropagation();
    toggleActiveStatus(docId, currentStatus);
  };

  const toggleActiveStatus = async (docId, currentStatus) => {
    try {
      const docRef = doc(firestore, 'pins', docId);
      await updateDoc(docRef, { isActive: !currentStatus });
      console.log('isActive status updated successfully.');
    } catch (error) {
      console.error('Error updating isActive status:', error);
    }
  };

  const handleTimeFrameChange = (e) => {
    const { name, value } = e.target;
    setTimeFrame((prev) => ({ ...prev, [name]: value }));
  };

  const confirmTimeFrameChange = async () => {
    try {
      const { startTime, endTime } = timeFrame;
      const docRef = doc(firestore, 'pins', selectedImage.docId);
      await updateDoc(docRef, { activationTime: startTime, endTime });
      console.log('Time frame updated successfully.');
    } catch (error) {
      console.error('Error updating time frame:', error);
    } finally {
      setTimeFrameModalOpen(false);
    }
  };

  const openTimeFrameModal = (image) => {
    setSelectedImage(image);
    setTimeFrame({
      startTime: image.activationTime || '',
      endTime: image.endTime || '',
    });
    setTimeFrameModalOpen(true);
  };

  const handleDeleteAccount = async (accountId, accountUid) => {
    try {
      const originalUser = auth.currentUser;
      const originalToken = await originalUser.getIdToken(true);
      const userDocRef = doc(firestore, 'accounts', accountId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error("User does not exist.");
      }
      const imagesCollection = collection(firestore, 'pins');
      const imagesQuery = query(imagesCollection, where('userId', '==', accountUid));
      const imagesSnapshot = await getDocs(imagesQuery);
      imagesSnapshot.forEach(async (imageDoc) => {
        console.log('Updating Image:', imageDoc.id);
        await updateDoc(imageDoc.ref, { userId: 'Store' });
      });
      const { email, password } = userDoc.data();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userToDelete = userCredential.user;

      await deleteUser(userToDelete);

      await deleteDoc(doc(firestore, 'accounts', accountId));

      await setDB(dbRef(database, `status/${accountUid}`), null);
      await updateCurrentUser(auth, originalUser);
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error deleting account');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setInfoModalOpen(false);
      }
    };
    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [infoModalOpen]);

  const handleShowInfo = (machineId, event) => {
    const account = accounts.find(account => account.uid === machineId);
    if (account) {
      setInfoContent(account);
      setInfoDropdownPosition({ top: event.clientY, left: event.clientX });
      setInfoModalOpen(true);
    }
  };
  const handlePlayModeChange = async (docId, newMode) => {
    try {
      const docRef = doc(firestore, 'pins', docId);
      await updateDoc(docRef, { playMode: newMode });
      console.log('Play mode updated successfully.');
    } catch (error) {
      console.error('Error updating play mode:', error);
    }
  };
  return (
    <div className="home-container">
      <h2>Player List</h2>
      <div className="flex-box">
        <div className={`machine-box ${machineIsOpen['Store'] ? 'open' : ''} ${zoomedMachine === 'Store' ? 'zoomed' : ''}`}>
          <div className="machine-header" onClick={() => toggleMachineBox('Store')}>
            <h3>Assets</h3>
            {/* <button className="button-player" onClick={(e) => { e.stopPropagation(); toggleZoom('Store'); }}>Zoom</button>
            <button className="button-player" onClick={(e) => { e.stopPropagation(); handleShowInfo('Store'); }}>Info</button> */}
          </div>
          <div className="dropdown-indicator" onClick={() => toggleMachineBox('Store')}>{machineIsOpen['Store'] ? '▲' : '▼'}</div>
          {machineIsOpen['Store'] && (
            <div className="images">
              {storeImages.map(image => (
                <div key={image.id} className={`image-item ${image.isActive ? '' : 'inactive'} ${selectedImage && selectedImage.docId === image.id ? 'selected' : ''}`} onClick={() => handleImageSelect(image.imageUrl, image.id)}>
                  {image.type === 'video' ? (
                    <video src={image.imageUrl} controls muted />
                  ) : (
                    <img src={image.imageUrl} alt={`Machine`} />
                  )}
                  <label onClick={(e) => handleCheckboxClick(e, image.id, image.isActive)}>
                    <input
                      type="checkbox"
                      checked={image.isActive}
                      onChange={() => toggleActiveStatus(image.id, image.isActive)}
                    />
                    {image.isActive ? "Active" : "Inactive"}
                  </label>
                  <button onClick={() => openTimeFrameModal(image)}>Set Time</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {machineIds.map((machineId) => {
          const account = accounts.find(account => account.uid === machineId);
          return (
            <div key={machineId} className={`machine-box ${machineIsOpen[machineId] ? 'open' : ''} ${zoomedMachine === machineId ? 'zoomed' : ''}`}>
              <div className="machine-header" onClick={() => toggleMachineBox(machineId)}>
                <h3 title={`Player: ${machineId}`}>Player: {machineId}</h3>
                <div className="status-wrapper">
                  <div className="status-indicator">
                    {getStatusIcon(otherMachineStatus[machineId]?.state)} {getStatusLabel(otherMachineStatus[machineId]?.state)}
                  </div>
                </div >
                <button className="button-player" onClick={(e) => { e.stopPropagation(); toggleZoom(machineId); }}>Zoom</button>
                <button className="button-player" onClick={(e) => { e.stopPropagation(); handleShowInfo(machineId, e); }}>Info</button>
                <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteAccount(account.id, account.uid); }}>Delete</button>
              </div>
              <div className="dropdown-indicator" onClick={() => toggleMachineBox(machineId)}>{machineIsOpen[machineId] ? '▲' : '▼'}</div>
              {machineIsOpen[machineId] && (
                <div className="images">
                  {machineImages[machineId] && machineImages[machineId].map(image => (
                    <div key={image.id} className={`image-item ${image.isActive ? '' : 'inactive'} ${selectedImage && selectedImage.docId === image.id ? 'selected' : ''}`} onClick={() => handleImageSelect(image.imageUrl, image.id)}>
                      {image.type === 'video' ? (
                        <video src={image.imageUrl} controls muted />
                      ) : (
                        <img src={image.imageUrl} alt={`Machine`} />
                      )}
                      <label onClick={(e) => handleCheckboxClick(e, image.id, image.isActive)}>
                        <input
                          type="checkbox"
                          checked={image.isActive}
                          onChange={() => toggleActiveStatus(image.id, image.isActive)}
                        />
                        {image.isActive ? "Active" : "Inactive"}
                      </label>
                      <label>Play Mode:</label>
                        <select
                          value={image.playMode}
                          onChange={(e) => handlePlayModeChange(image.id, e.target.value)}
                        >
                          <option value="alwaysOn">Always On</option>
                          <option value="timeBased">Time-Based</option>
                        </select>
                      <button onClick={() => openTimeFrameModal(image)}>Set Time</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {confirmModalOpen && (
        <div className="confirmation-modal">
          <h3>Confirm UID Change</h3>
          <p>Are you sure you want to change the UID of the selected image?</p>
          <div className="confirmation-dropdown">
            <select onChange={(e) => confirmUIDChange(e.target.value)}>
              <option value="">Select Destination</option>
              {machineIds.map(machineId => (
                <option key={machineId} value={machineId}>Machine {machineId}</option>
              ))}
              <option value="Store">Put back to Storage</option>
            </select>
          </div>
          <button className="cancel-button" onClick={() => setConfirmModalOpen(false)}>Cancel</button>
        </div>
      )}
      {timeFrameModalOpen && (
        <div className="time-frame-modal">
          <h3>Set Time Frame</h3>
          <div className="input-wrapper">
            <label>Start Time:</label>
            <input type="datetime-local" name="startTime" value={timeFrame.startTime} onChange={handleTimeFrameChange} />
          </div>
          <div className="input-wrapper">
            <label>End Time:</label>
            <input type="datetime-local" name="endTime" value={timeFrame.endTime} onChange={handleTimeFrameChange} />
          </div>
          <button onClick={confirmTimeFrameChange}>Confirm</button>
          <button className="cancel-button" onClick={() => setTimeFrameModalOpen(false)}>Cancel</button>
        </div>
      )}
      {infoModalOpen && (
        <div className="info-dropdown open" style={{ top: infoDropdownPosition.top, left: infoDropdownPosition.left }} ref={dropdownRef}>
          <div className="info-modal-content">
            <h3>Player Information</h3>
            {infoContent && (
              <div>
                <p><strong>Email:</strong> {infoContent.email}</p>
                <p><strong>Password:</strong> {infoContent.password}</p>
                <p><strong>UID:</strong> {infoContent.uid}</p>
                <p><strong>Type:</strong> {infoContent.type}</p>
              </div>
            )}
            {/* <button onClick={() => setInfoModalOpen(false)}>Close</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerHome;
