import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, doc, updateDoc, where } from 'firebase/firestore';
import '../../components/Style/PlayerHome.css';

const firestore = getFirestore();

const PlayerHome = ({ isOnline, otherMachineStatus }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [timeFrameModalOpen, setTimeFrameModalOpen] = useState(false);
  const [machineIds, setMachineIds] = useState([]);
  const [machineImages, setMachineImages] = useState({});
  const [storeImages, setStoreImages] = useState([]);
  const [machineIsOpen, setMachineIsOpen] = useState({});
  const [zoomedMachine, setZoomedMachine] = useState(null);
  const [timeFrame, setTimeFrame] = useState({ startTime: '', endTime: '' });

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

  return (
    <div className="home-container">
      {/* <h2>Player List</h2>
      <ul className='account-ul'>
        {machineIds.map(machineId => (
          <li key={machineId} className="account-li">
            Player: {machineId}: <span className="status-indicator" style={{ backgroundColor: otherMachineStatus[machineId]?.state === 'online' ? 'green' : 'red' }} /> {otherMachineStatus[machineId]?.state}
          </li>
        ))}
      </ul> */}
      <div className="flex-box">
        <div className={`machine-box ${machineIsOpen['Store'] ? 'open' : ''} ${zoomedMachine === 'Store' ? 'zoomed' : ''}`}>
          <div className="machine-header" onClick={() => toggleMachineBox('Store')}>
            <h3>Access-Storage
              <p></p>
            </h3>
            <button onClick={(e) => { e.stopPropagation(); toggleZoom('Store'); }}>Zoom</button>
          </div>
          <div className="dropdown-indicator" onClick={() => toggleMachineBox('Store')}>{machineIsOpen['Store'] ? '▲' : '▼'}</div>
          {machineIsOpen['Store'] && (
            <div className="images">
              {storeImages.map(image  => (
                <div key={image.id} className={`image-item ${image.isActive ? '' : 'inactive'} ${selectedImage && selectedImage.docId === image.id ? 'selected' : ''}`} onClick={() => handleImageSelect(image.imageUrl, image.id)}>
                  {image.type === 'video' ? (  
                    <video src={image.imageUrl} controls muted/>
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
        {Object.keys(machineImages).map(machineId => (
          <div key={machineId} className={`machine-box ${machineIsOpen[machineId] ? 'open' : ''} ${zoomedMachine === machineId ? 'zoomed' : ''}`}>
            <div className="machine-header" onClick={() => toggleMachineBox(machineId)}>
              <h3 title={`Player: ${machineId}`}>Player: {machineId}</h3>
              <div className="status-wrapper">
                <div className="status-indicator">
                  {getStatusIcon(otherMachineStatus[machineId]?.state)} {getStatusLabel(otherMachineStatus[machineId]?.state)}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleZoom(machineId); }}>Zoom</button>
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
                      <button onClick={() => openTimeFrameModal(image)}>Set Time</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
    </div>
  );
};

export default PlayerHome;
