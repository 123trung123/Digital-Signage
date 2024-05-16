// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
// import { storage } from '../firebaseConfig';
// import { onSnapshot } from 'firebase/firestore';
// import './home.css'

// const firestore = getFirestore();

// const Home = ({ isOnline, otherMachineStatus }) => {
//   const [selectedMachineId, setSelectedMachineId] = useState('');
//   const [selectedImageUrl, setSelectedImageUrl] = useState('');
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [imageUrls, setImageUrls] = useState([]);
//   const [selectedImageActive, setSelectedImageActive] = useState(false);

//   useEffect(() => {
//     const fetchImageUrls = () => {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef);
      
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const urls = [];
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           urls.push(data.imageUrl);
//         });
//         setImageUrls(urls);
//       });
  
//       return unsubscribe;
//     };
  
//     fetchImageUrls();
//   }, []);
  

//   const handleMachineIdChange = (event) => {
//     const newMachineId = event.target.value;
//     setSelectedMachineId(newMachineId);
//   };

//   // const handleImageSelect = (imageUrl) => {
//   //   setSelectedImageUrl(imageUrl);
//   //   setConfirmModalOpen(true);
//   // };
//   const handleImageSelect = (imageUrl, isActive) => {
//     setSelectedImageUrl(imageUrl);
//     setSelectedImageActive(isActive); // Set activation status
//     setConfirmModalOpen(true);
//   };
//   // const confirmUIDChange = async () => {
//   //   try {
//   //     // Find the document in Firestore that corresponds to the selected image URL
//   //     const pinsRef = collection(firestore, 'pins');
//   //     const q = query(pinsRef, where('imageUrl', '==', selectedImageUrl));
//   //     const querySnapshot = await getDocs(q);
//   //     if (!querySnapshot.empty) {
//   //       // Update the machine ID (UID) of the selected image in Firestore
//   //       const docRef = doc(firestore, 'pins', querySnapshot.docs[0].id);
//   //       await updateDoc(docRef, { userId: selectedMachineId });
//   //       console.log('UID updated successfully.');
//   //     } else {
//   //       console.error('Document not found for the selected image URL.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error updating machine ID:', error);
//   //   } finally {
//   //     setConfirmModalOpen(false);
//   //   }
//   // };
//   const confirmUIDChange = async () => {
//     try {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef, where('imageUrl', '==', selectedImageUrl));
//       const querySnapshot = await getDocs(q);
//       if (!querySnapshot.empty) {
//         const docRef = doc(firestore, 'pins', querySnapshot.docs[0].id);
//         await updateDoc(docRef, { userId: selectedMachineId, isActive: selectedImageActive });
//         console.log('UID and activation status updated successfully.');
//       } else {
//         console.error('Document not found for the selected image URL.');
//       }
//     } catch (error) {
//       console.error('Error updating machine ID and activation status:', error);
//     } finally {
//       setConfirmModalOpen(false);
//     }
//   };
//   return (
//     <div className="home-container">
//       <div className="machine-id-select">
//         <label htmlFor="machineId">Select Machine ID:</label>
//         <select id="machineId" value={selectedMachineId} onChange={handleMachineIdChange}>
//           <option value="">--Select Machine ID--</option>
//           {Object.keys(otherMachineStatus).map((machineId) => (
//             <option key={machineId} value={machineId}>
//               {machineId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="image-container">
//         <h2>Images</h2>
//         <div className="images">
//           {imageUrls.map((url, index) => (
//             <img key={index} src={url} alt={`Image ${index}`} onClick={() => handleImageSelect(url)} style={{ border: selectedImageUrl === url ? '2px solid blue' : 'none' }} />
//           ))}
          
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {confirmModalOpen && (
//         <div className="confirmation-modal">
//           <h3>Confirm UID Change</h3>
//           <p>Are you sure you want to change the UID of the selected image?</p>
//           <div className="confirmation-buttons">
//             <button onClick={confirmUIDChange}>Confirm</button>
//             <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;





























// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
// import { storage } from '../firebaseConfig';
// import { onSnapshot } from 'firebase/firestore';
// import './home.css'

// const firestore = getFirestore();

// const Home = ({ isOnline, otherMachineStatus }) => {
//   const [selectedMachineId, setSelectedMachineId] = useState('');
//   const [selectedImageUrl, setSelectedImageUrl] = useState('');
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [imageUrls, setImageUrls] = useState([]);
  
//   useEffect(() => {
//     const fetchImageUrls = () => {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef);
      
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const urls = [];
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           urls.push({ ...data, id: doc.id }); // Include document ID
//         });
//         setImageUrls(urls);
//       });
  
//       return unsubscribe;
//     };
  
//     fetchImageUrls();
//   }, []);

//   const handleMachineIdChange = (event) => {
//     const newMachineId = event.target.value;
//     setSelectedMachineId(newMachineId);
//   };

//   const handleImageSelect = (imageUrl) => {
//     setSelectedImageUrl(imageUrl);
//     setConfirmModalOpen(true);
//   };

//   const confirmUIDChange = async (isActive) => {
//     try {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef, where('imageUrl', '==', selectedImageUrl));
//       const querySnapshot = await getDocs(q);
//       if (!querySnapshot.empty) {
//         const docRef = doc(firestore, 'pins', querySnapshot.docs[0].id);
//         await updateDoc(docRef, { isActive });
//         console.log('isActive updated successfully.');
//       } else {
//         console.error('Document not found for the selected image URL.');
//       }
//     } catch (error) {
//       console.error('Error updating isActive:', error);
//     } finally {
//       setConfirmModalOpen(false);
//     }
//   };
  
//   return (
//     <div className="home-container">
//       <div className="machine-id-select">
//         <label htmlFor="machineId">Select Machine ID:</label>
//         <select id="machineId" value={selectedMachineId} onChange={handleMachineIdChange}>
//           <option value="">--Select Machine ID--</option>
//           {Object.keys(otherMachineStatus).map((machineId) => (
//             <option key={machineId} value={machineId}>
//               {machineId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="image-container">
//         <h2>Images</h2>
//         <div className="images">
//           {imageUrls.map((item) => (
//             <div key={item.id} className="image-item">
//               <img src={item.imageUrl} alt={`Image`} onClick={() => handleImageSelect(item.imageUrl)} style={{ border: selectedImageUrl === item.imageUrl ? '2px solid blue' : 'none' }} />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={item.isActive}
//                   onChange={(e) => confirmUIDChange(e.target.checked)}
//                 />
//                 {item.isActive ? "Active" : "Inactive"}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {confirmModalOpen && (
//         <div className="confirmation-modal">
//           <h3>Confirm isActive Change</h3>
//           <p>Are you sure you want to change the isActive status of the selected image?</p>
//           <div className="confirmation-buttons">
//             <button onClick={() => confirmUIDChange(true)}>Activate</button>
//             <button onClick={() => confirmUIDChange(false)}>Deactivate</button>
//             <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;























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
    // const groupImagesByMachineId = () => {
    //   const groupedImages = {};
    //   machineIds.forEach(machineId => {
    //     groupedImages[machineId] = [];
    //   });

    //   const pinsRef = collection(firestore, 'pins');
    //   const q = query(pinsRef);
    //   const unsubscribe = onSnapshot(q, querySnapshot => {
    //     const imagesByMachine = {};
    //     querySnapshot.forEach(doc => {
    //       const { userId, imageUrl, isActive } = doc.data();
    //       if (groupedImages[userId]) {
    //         groupedImages[userId].push({ id: doc.id, imageUrl, isActive });
    //       }
    //       imagesByMachine[userId] = groupedImages[userId];
    //     });
    //     setMachineImages(imagesByMachine);
    //   });
    //   return unsubscribe;
    // };
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

  // return (
  //   <div className="home-container">
  //     {Object.keys(machineImages).map(machineId => (
  //       <div key={machineId} className="machine-box">
  //         <h2>Machine ID: {machineId}</h2>
  //         <div className="images">
  //           {machineImages[machineId] && machineImages[machineId].map(image => (
  //             <div key={image.id} className="image-item">
  //               <img
  //                 src={image.imageUrl}
  //                 alt={`Machine Image`}
  //                 onClick={() => handleImageSelect(image.imageUrl, image.id)}
  //               />
  //               <label>
  //                 <input
  //                   type="checkbox"
  //                   checked={image.isActive}
  //                   onChange={() => toggleActiveStatus(image.id, image.isActive)}
  //                 />
  //                 {image.isActive ? "Active" : "Inactive"}
  //               </label>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     ))}
//   return (
//     <div className="home-container">
//       {/* your existing code */}
//       {Object.entries(otherMachineStatus).map(([machineId, status]) => (
//             <li key={machineId}>
//               Machine {machineId}: <span className="status-indicator" style={{ backgroundColor: status.state === 'online' ? 'green' : 'red' }} /> {status.state}
//             </li>
//           ))}
//       {Object.keys(machineImages).map(machineId=> (
        
//         <div key={machineId} className="machine-box">
          
//           <h2>Machine ID: {machineId}</h2>
          
//           <div className="images">
//             {machineImages[machineId] && machineImages[machineId].map(image => (
//               <div key={image.id} className={`image-item ${image.isActive ? 'fade-in' : ''}`}>
//                 <img
//                   src={image.imageUrl}
//                   alt={`Machine Image`}
//                   onClick={() => handleImageSelect(image.imageUrl, image.id)}
//                 />
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={image.isActive}
//                     onChange={() => toggleActiveStatus(image.id, image.isActive)}
//                   />
//                   {image.isActive ? "Active" : "Inactive"}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//       {/* Confirmation Modal */}
//       {confirmModalOpen && (
//   <div className="confirmation-modal">
//     <h3>Confirm UID Change</h3>
//     <p>Are you sure you want to change the UID of the selected image?</p>
//     <div className="confirmation-dropdown">
//       <select onChange={(e) => confirmUIDChange(e.target.value)}>
//         <option value="">Select Machine ID</option>
//         {Object.keys(otherMachineStatus).map(machineId => (
//           <option key={machineId} value={machineId}>{machineId}</option>
//         ))}
//       </select>
//     </div>
//     <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//   </div>
// )}
//     </div>
//   );
// };

// export default Home;
// return (
//   <div className="home-container">
//     {/* your existing code */}
//     {Object.keys(machineImages).map(machineId => (
//       <div key={machineId} className="machine-box">
//         <div className="machine-header">
//           <h2>Machine ID: {machineId}</h2>
//           <p>Status: {otherMachineStatus[machineId] ? otherMachineStatus[machineId].state : 'Unknown'}</p>
//         </div>
        
//         <div className="images">
//           {machineImages[machineId] && machineImages[machineId].map(image => (
//             <div key={image.id} className={`image-item ${image.isActive ? 'fade-in' : ''}`}>
//               <img
//                 src={image.imageUrl}
//                 alt={`Machine Image`}
//                 onClick={() => handleImageSelect(image.imageUrl, image.id)}
//               />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={image.isActive}
//                   onChange={() => toggleActiveStatus(image.id, image.isActive)}
//                 />
//                 {image.isActive ? "Active" : "Inactive"}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//     ))}
//     {/* Confirmation Modal */}
//     {confirmModalOpen && (
//       <div className="confirmation-modal">
//         <h3>Confirm UID Change</h3>
//         <p>Are you sure you want to change the UID of the selected image?</p>
//         <div className="confirmation-dropdown">
//           <select onChange={(e) => confirmUIDChange(e.target.value)}>
//             <option value="">Select Machine ID</option>
//             {Object.keys(otherMachineStatus).map(machineId => (
//               <option key={machineId} value={machineId}>{machineId}</option>
//             ))}
//           </select>
//         </div>
//         <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//       </div>
//     )}
//   </div>
// );
// };

// export default Home;
return (
  <div className="home-container">
            <h2>Machine List</h2>
        <ul>
          {Object.entries(otherMachineStatus).map(([machineId, status]) => (
            <li key={machineId}>
              Machine {machineId}: <span className="status-indicator" style={{ backgroundColor: status.state === 'online' ? 'green' : 'red' }} /> {status.state}
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
              <div key={image.id} className={`image-item ${image.isActive ? 'fade-in' : ''}`}onClick={() => handleImageSelect(image.imageUrl, image.id)}>
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
            {Object.keys(otherMachineStatus).map(machineId => (
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










// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
// import { onSnapshot } from 'firebase/firestore';
// import './home.css'; // Import home.css for styling

// const firestore = getFirestore();

// const Home = ({ otherMachineStatus }) => {
//   const [selectedMachineId, setSelectedMachineId] = useState('');
//   const [selectedImageUrl, setSelectedImageUrl] = useState('');
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [imageData, setImageData] = useState([]);

//   useEffect(() => {
//     const fetchImageData = () => {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef);
      
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const data = [];
//         snapshot.forEach((doc) => {
//           data.push({ id: doc.id, ...doc.data() });
//         });
//         setImageData(data);
//       });
  
//       return unsubscribe;
//     };
  
//     fetchImageData();
//   }, []);

//   const handleMachineIdChange = (event) => {
//     const newMachineId = event.target.value;
//     setSelectedMachineId(newMachineId);
//   };

//   const handleImageSelect = (id) => {
//     setSelectedImageUrl(id);
//     setConfirmModalOpen(true);
//   };

//   const confirmUIDChange = async (id) => {
//     try {
//       const docRef = doc(firestore, 'pins', id);
//       const originalData = (imageData.find(item => item.id === id) || {}).userId;
      
//       await updateDoc(docRef, { userId: "1" });
//       setTimeout(async () => {
//         await updateDoc(docRef, { userId: originalData });
//         console.log('UID updated successfully.');
//       }, 1000);
//     } catch (error) {
//       console.error('Error updating machine ID:', error);
//     } finally {
//       setConfirmModalOpen(false);
//     }
//   };
  
//   return (
//     <div className="home-container">
//       <div className="machine-id-select">
//         <label htmlFor="machineId">Select Machine ID:</label>
//         <select id="machineId" value={selectedMachineId} onChange={handleMachineIdChange}>
//           <option value="">--Select Machine ID--</option>
//           {Object.keys(otherMachineStatus).map((machineId) => (
//             <option key={machineId} value={machineId}>
//               {machineId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="image-container">
//         <h2>Images</h2>
//         <div className="images">
//           {imageData.map(({ id, imageUrl, userId }, index) => (
//             <div key={id} className="image-item">
//               <img src={imageUrl} alt={`Image ${index}`} onClick={() => handleImageSelect(id)} className={selectedImageUrl === id ? 'selected' : ''} />
//               <div className="uid">{userId}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {confirmModalOpen && (
//         <div className="confirmation-modal">
//           <h3>Confirm UID Change</h3>
//           <p>Are you sure you want to change the UID of the selected image?</p>
//           <div className="confirmation-buttons">
//             <button onClick={() => confirmUIDChange(selectedImageUrl)}>Confirm</button>
//             <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;




// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
// import { onSnapshot } from 'firebase/firestore';

// const firestore = getFirestore();

// const Home = ({ otherMachineStatus }) => {
//   const [selectedMachineId, setSelectedMachineId] = useState('');
//   const [selectedImageUrl, setSelectedImageUrl] = useState('');
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [imageUrls, setImageUrls] = useState([]);

//   useEffect(() => {
//     const fetchImageUrls = () => {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef);
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const urls = [];
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           urls.push({ imageUrl: data.imageUrl, userId: data.userId });
//         });
//         setImageUrls(urls);
//       });
//       return unsubscribe;
//     };
//     fetchImageUrls();
//   }, []);

//   const handleMachineIdChange = (event) => {
//     const newMachineId = event.target.value;
//     setSelectedMachineId(newMachineId);
//   };

//   const handleImageSelect = (imageUrl) => {
//     setSelectedImageUrl(imageUrl);
//     setConfirmModalOpen(true);
//   };

//   const confirmUIDChange = async () => {
//     try {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef, where('imageUrl', '==', selectedImageUrl));
//       const querySnapshot = await getDocs(q);
//       if (!querySnapshot.empty) {
//         const originalUid = querySnapshot.docs[0].data().userId;
//         const docRef = doc(firestore, 'pins', querySnapshot.docs[0].id);
//         await updateDoc(docRef, { userId: "1" });
//         setTimeout(async () => {
//           await updateDoc(docRef, { userId: originalUid });
//           console.log('UID updated successfully.');
//         }, 1000);
//       } else {
//         console.error('Document not found for the selected image URL.');
//       }
//     } catch (error) {
//       console.error('Error updating machine ID:', error);
//     } finally {
//       setConfirmModalOpen(false);
//     }
//   };
  
//   return (
//     <div className="home-container">
//       <div className="machine-id-select">
//         <label htmlFor="machineId">Select Machine ID:</label>
//         <select id="machineId" value={selectedMachineId} onChange={handleMachineIdChange}>
//           <option value="">--Select Machine ID--</option>
//           {Object.keys(otherMachineStatus).map((machineId) => (
//             <option key={machineId} value={machineId}>
//               {machineId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="image-container">
//         <h2>Images</h2>
//         <div className="images">
//           {imageUrls.map(({ imageUrl, userId }, index) => (
//             <div key={index} className="image-item">
//               <img src={imageUrl} alt={`Image ${index}`} onClick={() => handleImageSelect(imageUrl)} className={selectedImageUrl === imageUrl ? 'selected' : ''} />
//               <div className="uid">{userId}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {confirmModalOpen && (
//         <div className="confirmation-modal">
//           <h3>Confirm UID Change</h3>
//           <p>Are you sure you want to change the UID of the selected image?</p>
//           <div className="confirmation-buttons">
//             <button onClick={confirmUIDChange}>Confirm</button>
//             <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
// import { onSnapshot } from 'firebase/firestore';
// import './home.css'

// const firestore = getFirestore();

// const Home = ({ otherMachineStatus }) => {
//   const [selectedMachineId, setSelectedMachineId] = useState('');
//   const [selectedImageUrl, setSelectedImageUrl] = useState('');
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [imageUrls, setImageUrls] = useState([]);

//   useEffect(() => {
//     const fetchImageUrls = () => {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef);
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const urls = [];
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           urls.push({ imageUrl: data.imageUrl, userId: data.userId });
//         });
//         setImageUrls(urls);
//       });
//       return unsubscribe;
//     };
//     fetchImageUrls();
//   }, []);

//   const handleMachineIdChange = (event) => {
//     const newMachineId = event.target.value;
//     setSelectedMachineId(newMachineId);
//   };

//   const handleImageSelect = (imageUrl) => {
//     setSelectedImageUrl(imageUrl);
//     setConfirmModalOpen(true);
//   };

//   const confirmUIDChange = async () => {
//     try {
//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef, where('imageUrl', '==', selectedImageUrl));
//       const querySnapshot = await getDocs(q);
//       if (!querySnapshot.empty) {
//         const originalUid = querySnapshot.docs[0].data().userId;
//         const docRef = doc(firestore, 'pins', querySnapshot.docs[0].id);
//         await updateDoc(docRef, { userId: "1" });
//         setTimeout(async () => {
//           await updateDoc(docRef, { userId: originalUid });
//           console.log('UID updated successfully.');
//         }, 1000);
//       } else {
//         console.error('Document not found for the selected image URL.');
//       }
//     } catch (error) {
//       console.error('Error updating machine ID:', error);
//     } finally {
//       setConfirmModalOpen(false);
//     }
//   };
  
//   return (
//     <div className="home-container">
//       <div className="machine-id-select">
//         <label htmlFor="machineId">Select Machine ID:</label>
//         <select id="machineId" value={selectedMachineId} onChange={handleMachineIdChange}>
//           <option value="">--Select Machine ID--</option>
//           {Object.keys(otherMachineStatus).map((machineId) => (
//             <option key={machineId} value={machineId}>
//               {machineId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="image-container">
//         <h2>Images</h2>
//         <div className="images">
//           {imageUrls.map(({ imageUrl, userId }, index) => (
//             <div key={index} className="image-item">
//               <img src={imageUrl} alt={`Image ${index}`} onClick={() => handleImageSelect(imageUrl)} className={selectedImageUrl === imageUrl ? 'selected' : ''} />
//               <div className="uid">{userId}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {confirmModalOpen && (
//         <div className="confirmation-modal">
//           <h3>Confirm UID Change</h3>
//           <p>Are you sure you want to change the UID of the selected image?</p>
//           <div className="confirmation-buttons">
//             <button onClick={confirmUIDChange}>Confirm</button>
//             <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
