import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
import { storage } from '../firebaseConfig';
import { onSnapshot } from 'firebase/firestore';

const firestore = getFirestore();
const Home = ({ isOnline, otherMachineStatus }) => {
    const [selectedMachineId, setSelectedMachineId] = useState('');
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
  useEffect(() => {
    const fetchImageUrls = () => {
      const pinsRef = collection(firestore, 'pins');
      const q = query(pinsRef);
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const urls = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          urls.push(data.imageUrl);
        });
        setImageUrls(urls);
      });
  
      return unsubscribe;
    };
  
    fetchImageUrls();
  }, []);
  

  const handleMachineIdChange = (event) => {
    const newMachineId = event.target.value;
    setSelectedMachineId(newMachineId);
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setConfirmModalOpen(true);
  };
  return (
    <div className="home-container">
      {/* <div className="machine-status">
        <span className="status-indicator" style={{ backgroundColor: isOnline ? 'green' : 'red' }} />
        <p>Machine Status: {isOnline ? 'Online' : 'Offline'}</p>
      </div> */}

      <div className="other-machine-status">
        <h2>Machine Status</h2>
        <ul>
          {Object.entries(otherMachineStatus).map(([machineId, status]) => (
            <li key={machineId}>
              Machine {machineId}: <span className="status-indicator" style={{ backgroundColor: status.state === 'online' ? 'green' : 'red' }} /> {status.state}
            </li>
          ))}
        </ul>
      </div>

      <div className="image-container">
        <h2>Images</h2>
        <div className="images">
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Image ${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
