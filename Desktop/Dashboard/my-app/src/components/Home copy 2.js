import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, doc, updateDoc } from 'firebase/firestore';
import { storage } from '../firebaseConfig';
import './home.css';

const firestore = getFirestore();

const Home = ({ isOnline, otherMachineStatus }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [machineIds, setMachineIds] = useState([]);
  const [machineImages, setMachineImages] = useState({});
  const [openMachineId, setOpenMachineId] = useState(null);
  const toggleMachineBox = (machineId) => {
    setOpenMachineId(openMachineId === machineId ? null : machineId);
  };

  const getStatusIcon = (status) => {
    return status === 'online' ? '🟢' : '🔴';
  };

  const getStatusLabel = (status) => {
    return status === 'online' ? 'Online' : 'Offline';
  };

  useEffect(() => {
    // Fetch all machine IDs (UIDs)
    const fetchMachineIds = async () => {
      try {
        const pinsRef = collection(firestore, 'pins');
        const q = query(pinsRef);
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const uniqueMachineIds = new Set();
          querySnapshot.forEach(doc => uniqueMachineIds.add(doc.data().userId));
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
    // Group images by machine ID
    const groupImagesByMachineId = () => {
      const newImagesByMachine = {}; // Create a new object to store updated images
      
      const pinsRef = collection(firestore, 'pins');
      const q = query(pinsRef);
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const groupedImages = {};
        machineIds.forEach(machineId => {
          groupedImages[machineId] = [];
        });
    
        querySnapshot.forEach(doc => {
          const { userId, imageUrl, isActive } = doc.data();
          if (groupedImages[userId]) {
            groupedImages[userId].push({ id: doc.id, imageUrl, isActive });
          }
        });
    
        // Update newImagesByMachine object with groupedImages
        Object.keys(groupedImages).forEach(machineId => {
          newImagesByMachine[machineId] = [...groupedImages[machineId]];
        });
    
        setMachineImages(newImagesByMachine); // Update state with the new object
      });
    
      return unsubscribe;
    };
    
    groupImagesByMachineId();
  }, [machineIds]);

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

  const toggleActiveStatus = async (docId, currentStatus) => {
    try {
      const docRef = doc(firestore, 'pins', docId);
      await updateDoc(docRef, { isActive: !currentStatus });
      console.log('isActive status updated successfully.');
    } catch (error) {
      console.error('Error updating isActive status:', error);
    }
  };

  // Filter out admin accounts
  const nonAdminMachineIds = Object.keys(otherMachineStatus).filter(machineId => !otherMachineStatus[machineId]?.admin);

  return (
    <div className="home-container">
      <h2>Machine List</h2>
      <ul>
        {nonAdminMachineIds.map(machineId => (
          <li key={machineId}>
            Machine {machineId}: <span className="status-indicator" style={{ backgroundColor: otherMachineStatus[machineId]?.state === 'online' ? 'green' : 'red' }} /> {otherMachineStatus[machineId]?.state}
          </li>
        ))}
      </ul>
      {Object.keys(machineImages).map(machineId => (
        <div key={machineId} className={`machine-box ${openMachineId === machineId ? 'open' : ''}`}>
          <div className="machine-header" onClick={() => toggleMachineBox(machineId)}>
            <h3>Machine ID: {machineId}</h3>
            <h3><div className="status-indicator">
              {getStatusIcon(otherMachineStatus[machineId]?.state)} {getStatusLabel(otherMachineStatus[machineId]?.state)}
            </div>
            </h3>
          </div>
          <div className="dropdown-indicator">{openMachineId === machineId ? '▲' : '▼'}</div>
          {openMachineId === machineId && (
            <div className="images">
              {machineImages[machineId] && machineImages[machineId].map(image => (
                <div key={image.id} className={`image-item ${image.isActive ? 'fade-in' : ''}`} onClick={() => handleImageSelect(image.imageUrl, image.id)}>
                  <img
                    src={image.imageUrl}
                    alt={`Machine Image`}
                    onClick={() => handleImageSelect(image.imageUrl, image.id)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={image.isActive}
                      onChange={() => toggleActiveStatus(image.id, image.isActive)}
                    />
                    {image.isActive ? "Active" : "Inactive"}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="confirmation-modal">
          <h3>Confirm UID Change</h3>
          <p>Are you sure you want to change the UID of the selected image?</p>
          <div className="confirmation-dropdown">
            <select onChange={(e) => confirmUIDChange(e.target.value)}>
              <option value="">Select Machine ID</option>
              {nonAdminMachineIds.map(machineId => (
                <option key={machineId} value={machineId}>{machineId}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Home;
