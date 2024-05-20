// import React, { useState, useEffect } from 'react';
// import { collection, query, onSnapshot, getFirestore, doc, updateDoc, getDocs } from 'firebase/firestore';
// import { storage } from '../firebaseConfig';
// import './home.css';
// import { ref as dbRef, set as setDB, getDatabase } from 'firebase/database';
// const firestore = getFirestore();

// const Home = ({ isOnline, otherMachineStatus }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
//   const [machineIds, setMachineIds] = useState([]);
//   const [machineImages, setMachineImages] = useState({});
//   const [openMachineId, setOpenMachineId] = useState(null);
//   const [totalImages, setTotalImages] = useState(0);
//   const [totalSize, setTotalSize] = useState(0);

//   const toggleMachineBox = (machineId) => {
//     setOpenMachineId(openMachineId === machineId ? null : machineId);
//   };

//   const getStatusIcon = (status) => {
//     return status === 'online' ? '🟢' : '🔴';
//   };

//   const getStatusLabel = (status) => {
//     return status === 'online' ? 'Online' : 'Offline';
//   };

//   useEffect(() => {
//     const fetchMachineIds = async () => {
//       try {
//         const accountsRef = collection(firestore, 'accounts');
//         const q = query(accountsRef);
//         const unsubscribe = onSnapshot(q, querySnapshot => {
//           const uniqueMachineIds = new Set();
//           querySnapshot.forEach(doc => uniqueMachineIds.add(doc.data().uid));
//           setMachineIds(Array.from(uniqueMachineIds));
//         });
//         return unsubscribe;
//       } catch (error) {
//         console.error('Error fetching machine IDs:', error);
//       }
//     };

//     fetchMachineIds();
//   }, []);

//   useEffect(() => {
//     const groupImagesByMachineId = () => {
//       const newImagesByMachine = {};

//       const pinsRef = collection(firestore, 'pins');
//       const q = query(pinsRef);
//       const unsubscribe = onSnapshot(q, querySnapshot => {
//         const groupedImages = {};
//         machineIds.forEach(machineId => {
//           groupedImages[machineId] = [];
//         });

//         querySnapshot.forEach(doc => {
//           const { userId, imageUrl, isActive } = doc.data();
//           if (groupedImages[userId]) {
//             groupedImages[userId].push({ id: doc.id, imageUrl, isActive });
//           }
//         });

//         Object.keys(groupedImages).forEach(machineId => {
//           newImagesByMachine[machineId] = [...groupedImages[machineId]];
//         });

//         setMachineImages(newImagesByMachine);
//         let totalCount = 0;
//         Object.values(newImagesByMachine).forEach(images => {
//           totalCount += images.length;
//         });
//         setTotalImages(totalCount);
//       });

//       return unsubscribe;
//     };

//     groupImagesByMachineId();

//     const countTotalImages = async () => {
//       try {
//         const pinsRef = collection(firestore, 'pins');
//         const querySnapshot = await getDocs(pinsRef);
//         setTotalImages(querySnapshot.size);
//       } catch (error) {
//         console.error('Error counting total images:', error);
//       }
//     };

//     countTotalImages();
//   }, [machineIds]);

//   useEffect(() => {
//     const fetchImageMetadata = async () => {
//       try {
//         let totalSizeCount = 0;
//         const storageRef = storage.ref();
//         const allImagesRef = storageRef.child('images');

//         const imagesList = await allImagesRef.listAll();

//         for (const imageRef of imagesList.items) {
//           const metadata = await imageRef.getMetadata();
//           totalSizeCount += metadata.size;
//         }

//         setTotalSize(totalSizeCount);
//       } catch (error) {
//         console.error('Error fetching image metadata:', error);
//       }
//     };

//     fetchImageMetadata();
//   }, []);

//   const handleImageSelect = (imageUrl, docId) => {
//     setSelectedImage({ imageUrl, docId });
//     setConfirmModalOpen(true);
//   };

//   const confirmUIDChange = async (newMachineId) => {
//     try {
//       const docRef = doc(firestore, 'pins', selectedImage.docId);
//       await updateDoc(docRef, { userId: newMachineId });
//       console.log('UID updated successfully.');
//     } catch (error) {
//       console.error('Error updating UID:', error);
//     } finally {
//       setConfirmModalOpen(false);
//     }
//   };

//   const toggleActiveStatus = async (docId, currentStatus) => {
//     try {
//       const docRef = doc(firestore, 'pins', docId);
//       await updateDoc(docRef, { isActive: !currentStatus });
//       console.log('isActive status updated successfully.');
//     } catch (error) {
//       console.error('Error updating isActive status:', error);
//     }
//   };

//   return (
//     <div className="home-container">
//       <h2>Machine List</h2>
//       <ul>
//         {machineIds.map(machineId => (
//           <li key={machineId}>
//             Machine {machineId}: <span className="status-indicator" style={{ backgroundColor: otherMachineStatus[machineId]?.state === 'online' ? 'green' : 'red' }} /> {otherMachineStatus[machineId]?.state}
//           </li>
//         ))}
//       </ul>
//       {Object.keys(machineImages).map(machineId => (
//         <div key={machineId} className={`machine-box ${openMachineId === machineId ? 'open' : ''}`}>
//           <div className="machine-header" onClick={() => toggleMachineBox(machineId)}>
//             <h3>Machine ID: {machineId}</h3>
//             <h3><div className="status-indicator">
//               {getStatusIcon(otherMachineStatus[machineId]?.state)} {getStatusLabel(otherMachineStatus[machineId]?.state)}
//             </div>
//             </h3>
//           </div>
//           <div className="dropdown-indicator">{openMachineId === machineId ? '▲' : '▼'}</div>
//           {openMachineId === machineId && (
//             <div className="images">
//               {machineImages[machineId] && machineImages[machineId].map(image => (
//                 <div key={image.id} className={`image-item ${image.isActive ? 'fade-in' : ''}`} onClick={() => handleImageSelect(image.imageUrl, image.id)}>
//                   <img
//                     src={image.imageUrl}
//                     alt={`Machine Image`}
//                     onClick={() => handleImageSelect(image.imageUrl, image.id)}
//                   />
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={image.isActive}
//                       onChange={() => toggleActiveStatus(image.id, image.isActive)}
//                     />
//                     {image.isActive ? "Active" : "Inactive"}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//       <div>
//         <h3>Total Images: {totalImages}</h3>
//         <h3>Total Size: {totalSize} bytes</h3>
//       </div>
//       {/* Confirmation Modal */}
//       {confirmModalOpen && (
//         <div className="confirmation-modal">
//           <h3>Confirm UID Change</h3>
//           <p>Are you sure you want to change the UID of the selected image?</p>
//           <div className="confirmation-dropdown">
//             <select onChange={(e) => confirmUIDChange(e.target.value)}>
//               <option value="">Select Machine ID</option>
//               {machineIds.map(machineId => (
//                 <option key={machineId} value={machineId}>{machineId}</option>
//               ))}
//             </select>
//           </div>
//           <button onClick={() => setConfirmModalOpen(false)}>Cancel</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
// import React, { useState, useEffect } from 'react';
// import { getStorage, ref, listAll, getMetadata } from 'firebase/storage';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { storage } from '../firebaseConfig';
// import './home.css';

// const firestore = getFirestore();

// const Log = ({ isOnline, otherMachineStatus }) => {
//   const [pictures, setPictures] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [totalSize, setTotalSize] = useState(0); // State to store total size

//   useEffect(() => {
//     const fetchPicturesMetadata = async () => {
//       try {
//         const storage = getStorage(); // Initialize Firebase Storage
//         const imagesRef = ref(storage, 'images'); // Reference to the 'images' folder

//         const imagesList = await listAll(imagesRef); // List all items (images) in the 'images' folder

//         const pictureMetadata = await Promise.all(imagesList.items.map(async (imageRef) => {
//           const metadata = await getMetadata(imageRef); // Get metadata for each image
//           return {
//             name: metadata.name,
//             size: metadata.size,
//           };
//         }));

//         // Calculate total size during metadata fetching
//         const totalSize = pictureMetadata.reduce((acc, picture) => acc + picture.size, 0);

//         setPictures(pictureMetadata);
//         setTotalSize(totalSize);
//       } catch (error) {
//         console.error('Error fetching pictures metadata:', error);
//       }
//     };

//     fetchPicturesMetadata();
//   }, []);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const accountsRef = collection(firestore, 'accounts');
//         const querySnapshot = await getDocs(accountsRef);
//         const accountsData = querySnapshot.docs.map(doc => doc.data());
//         setAccounts(accountsData);
//       } catch (error) {
//         console.error('Error fetching accounts:', error);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   const totalPictures = pictures.length;
//   const totalAdmins = accounts.filter(account => account.type === 'ADMIN').length;
//   const totalPlayers = accounts.filter(account => account.type === 'PLAYER').length;
//   const totalAccounts = accounts.length;

//   // Display total size in a user-friendly format (e.g., KB, MB)
//   const formattedTotalSize = calculateFileSize(totalSize);

//   return (
//     <div className="home-container">
//       <h2>Account Summary</h2>
//       <p>Total Accounts: {totalAccounts}</p>
//       <p>Total Admins: {totalAdmins}</p>
//       <p>Total Players: {totalPlayers}</p>
//       <h2>Picture List</h2>
//       <p>Total Pictures: {totalPictures}</p>
//       <ul>
//         {pictures.map((picture, index) => (
//           <li key={index}>
//             <strong>Name:</strong> {picture.name}, <strong>Size:</strong> {picture.size} bytes
//           </li>
          
//         ))}
//       </ul>
//       <p>Total Storage Used: {formattedTotalSize}</p>

//       <h2>Online Status</h2>
//       <ul>
//         {accounts.map(account => (
//           <li key={account.id}>
//             {account.type === 'ADMIN' ? 'Admin' : 'Player'} {account.uid}: {otherMachineStatus[account.uid] ? 'Online' : 'Offline'}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// // Function to convert bytes to a user-friendly size format (optional)
// function calculateFileSize(bytes) {
//   const units = ['B', 'KB', 'MB', 'GB', 'TB'];
//   let i = 0;
//   while (bytes > 1024 && i < units.length - 1) {
//     bytes /= 1024;
//     ++i;
//   }
//   return `${bytes.toFixed(1)} ${units[i]}`;
// }

// export default Log;

// import React, { useState, useEffect } from 'react';
// import { getStorage, ref, listAll, getMetadata } from 'firebase/storage';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { ref as dbRef, getDatabase, onValue } from 'firebase/database';
// import './home.css';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart, ArcElement } from 'chart.js';

// Chart.register(ArcElement);

// const database = getDatabase();
// const firestore = getFirestore();

// const Log = ({ otherMachineStatus }) => {
//   const [pictures, setPictures] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [totalSize, setTotalSize] = useState(0); // State to store total size
//   const [onlineAdmins, setOnlineAdmins] = useState(0); // State to store count of online admins
//   const [onlinePlayers, setOnlinePlayers] = useState(0); // State to store count of online players
//   const [status, setStatus] = useState({}); // State to store the status of machines

//   useEffect(() => {
//     const fetchPicturesMetadata = async () => {
//       try {
//         const storage = getStorage(); // Initialize Firebase Storage
//         const imagesRef = ref(storage, 'images'); // Reference to the 'images' folder

//         const imagesList = await listAll(imagesRef); // List all items (images) in the 'images' folder

//         const pictureMetadata = await Promise.all(imagesList.items.map(async (imageRef) => {
//           const metadata = await getMetadata(imageRef); // Get metadata for each image
//           return {
//             name: metadata.name,
//             size: metadata.size,
//           };
//         }));

//         // Calculate total size during metadata fetching
//         const totalSize = pictureMetadata.reduce((acc, picture) => acc + picture.size, 0);

//         setPictures(pictureMetadata);
//         setTotalSize(totalSize);
//       } catch (error) {
//         console.error('Error fetching pictures metadata:', error);
//       }
//     };

//     fetchPicturesMetadata();
//   }, []);

//   useEffect(() => {
//     const statusRef = dbRef(database, 'status');
//     const handleStatusChange = (snapshot) => {
//       const statusData = snapshot.val();
//       setStatus(statusData || {});
//     };

//     const unsubscribe = onValue(statusRef, handleStatusChange);
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const accountsRef = collection(firestore, 'accounts');
//         const querySnapshot = await getDocs(accountsRef);
//         const accountsData = querySnapshot.docs.map(doc => doc.data());
//         setAccounts(accountsData);

//         // Count online admins and players
//         const onlineAdminsCount = accountsData.filter(account => account.type === 'ADMIN' && status[account.uid]).length;
//         const onlinePlayersCount = accountsData.filter(account => account.type === 'PLAYER' && status[account.uid]).length;
//         setOnlineAdmins(onlineAdminsCount);
//         setOnlinePlayers(onlinePlayersCount);
//       } catch (error) {
//         console.error('Error fetching accounts:', error);
//       }
//     };

//     fetchAccounts();
//   }, [status]); // Trigger effect when status changes

//   const totalPictures = pictures.length;
//   const totalAdmins = accounts.filter(account => account.type === 'ADMIN').length;
//   const totalPlayers = accounts.filter(account => account.type === 'PLAYER').length;
//   const totalAccounts = accounts.length;
//   const onlineDevices = onlineAdmins + onlinePlayers;
//   // Display total size in a user-friendly format (e.g., KB, MB)
//   const formattedTotalSize = calculateFileSize(totalSize);

//   const deviceData = {
//     labels: ['Total Devices', 'Online Devices'],
//     datasets: [
//       {
//         data: [totalAccounts, onlineDevices],
//         backgroundColor: ['#FF6384', '#36A2EB'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB'],
//       },
//     ],
//   };

//   const adminData = {
//     labels: ['Total Admins', 'Admins Online'],
//     datasets: [
//       {
//         data: [totalAdmins, onlineAdmins],
//         backgroundColor: ['#FF6384', '#36A2EB'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB'],
//       },
//     ],
//   };

//   const playerData = {
//     labels: ['Total Players', 'Players Online'],
//     datasets: [
//       {
//         data: [totalPlayers, onlinePlayers],
//         backgroundColor: ['#FF6384', '#36A2EB'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB'],
//       },
//     ],
//   };

//   return (
//     <div className="log-container">
//       <div className="log-charts-container">
//         <div className="log-chart">
//           <h2>All-Devices</h2>
//           <Doughnut data={deviceData} />
//           <div className="chart-info">
//             <p style={{ color: '#FF6384' }}>Total Devices: {totalAccounts}</p>
//             <p style={{ color: '#36A2EB' }}>Online Devices: {onlineDevices}</p>
//           </div>
//         </div>
//         <div className="log-chart">
//           <h2>Admins</h2>
//           <Doughnut data={adminData} />
//           <div className="chart-info">
//             <p style={{ color: '#FF6384' }}>Total Admins: {totalAdmins}</p>
//             <p style={{ color: '#36A2EB' }}>Admins Online: {onlineAdmins}</p>
//           </div>
//         </div>
//         <div className="log-chart">
//           <h2>Players</h2>
//           <Doughnut data={playerData} />
//           <div className="chart-info">
//             <p style={{ color: '#FF6384' }}>Total Players: {totalPlayers}</p>
//             <p style={{ color: '#36A2EB' }}>Players Online: {onlinePlayers}</p>
//           </div>
//         </div>
//         <div className="log-chart">
//           <h2>Access</h2>
//           <ul>
//             {pictures.map((picture, index) => (
//               <li key={index}>
//                 <strong>Name:</strong> {picture.name}, <strong>Size:</strong> {picture.size} bytes
//               </li>
//             ))}
//           </ul>
//           <div className="chart-info">
//             <p>Total Access: {totalPictures}</p>
//             <p>Total Storage Used: {formattedTotalSize}</p>
//           </div>
//         </div>
//       </div>
//       <div>
//         {/* <h2>Online Status</h2>
//         <ul>
//           {accounts.map(account => (
//             <li key={account.uid}>
//               {account.type === 'ADMIN' ? 'Admin' : 'Player'} {account.uid}: {status[account.uid] ? 'Online' : 'Offline'}
//             </li>
//           ))}
//         </ul> */}
//       </div>
//     </div>
//   );
// };

// function calculateFileSize(bytes) {
//   const units = ['B', 'KB', 'MB', 'GB', 'TB'];
//   let i = 0;
//   while (bytes > 1024 && i < units.length - 1) {
//     bytes /= 1024;
//     ++i;
//   }
//   return `${bytes.toFixed(1)} ${units[i]}`;
// }

// export default Log;
// import React, { useState, useEffect } from 'react';
// import { getStorage, ref, listAll, getMetadata } from 'firebase/storage';
// import { collection, query, onSnapshot, getFirestore } from 'firebase/firestore';
// import { ref as dbRef, getDatabase, onValue } from 'firebase/database';
// import './Style/Home.css';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart, ArcElement } from 'chart.js';

// Chart.register(ArcElement);

// const firestore = getFirestore();

// const Log = ({ otherMachineStatus }) => {
//   const [pictures, setPictures] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [totalSize, setTotalSize] = useState(0); // State to store total size
//   const [onlineAdmins, setOnlineAdmins] = useState(0); // State to store count of online admins
//   const [onlinePlayers, setOnlinePlayers] = useState(0); // State to store count of online players

//   useEffect(() => {
//     const fetchPicturesMetadata = async () => {
//       try {
//         const storage = getStorage(); // Initialize Firebase Storage
//         const imagesRef = ref(storage, 'images'); // Reference to the 'images' folder

//         const imagesList = await listAll(imagesRef); // List all items (images) in the 'images' folder

//         const pictureMetadata = await Promise.all(imagesList.items.map(async (imageRef) => {
//           const metadata = await getMetadata(imageRef); // Get metadata for each image
//           return {
//             name: metadata.name,
//             size: metadata.size,
//           };
//         }));

//         // Calculate total size during metadata fetching
//         const totalSize = pictureMetadata.reduce((acc, picture) => acc + picture.size, 0);

//         setPictures(pictureMetadata);
//         setTotalSize(totalSize);
//       } catch (error) {
//         console.error('Error fetching pictures metadata:', error);
//       }
//     };

//     fetchPicturesMetadata();
//   }, []);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const accountsRef = collection(firestore, 'accounts');
//         const q = query(accountsRef);
//         const unsubscribe = onSnapshot(q, querySnapshot => {
//           const accountsData = querySnapshot.docs.map(doc => doc.data());
//           setAccounts(accountsData);

//           // Count online admins and players
//           const onlineAdminsCount = accountsData.filter(account => account.type === 'ADMIN' && otherMachineStatus[account.uid]?.state === 'online').length;
//           const onlinePlayersCount = accountsData.filter(account => account.type === 'PLAYER' && otherMachineStatus[account.uid]?.state === 'online').length;
//           setOnlineAdmins(onlineAdminsCount);
//           setOnlinePlayers(onlinePlayersCount);
//         });
//         return unsubscribe;
//       } catch (error) {
//         console.error('Error fetching accounts:', error);
//       }
//     };

//     fetchAccounts();
//   }, [otherMachineStatus]); // Trigger effect when otherMachineStatus changes

//   const totalPictures = pictures.length;
//   const totalAdmins = accounts.filter(account => account.type === 'ADMIN').length;
//   const totalPlayers = accounts.filter(account => account.type === 'PLAYER').length;
//   const totalAccounts = accounts.length;
//   const onlineDevices = onlineAdmins + onlinePlayers;
//   // Display total size in a user-friendly format (e.g., KB, MB)
//   const formattedTotalSize = calculateFileSize(totalSize);

//   const deviceData = {
//     labels: ['Total Devices', 'Online Devices'],
//     datasets: [
//       {
//         data: [totalAccounts, onlineDevices],
//         backgroundColor: ['#FF6384', '#36A2EB'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB'],
//       },
//     ],
//   };

//   const adminData = {
//     labels: ['Total Admins', 'Admins Online'],
//     datasets: [
//       {
//         data: [totalAdmins, onlineAdmins],
//         backgroundColor: ['#FF6384', '#36A2EB'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB'],
//       },
//     ],
//   };

//   const playerData = {
//     labels: ['Total Players', 'Players Online'],
//     datasets: [
//       {
//         data: [totalPlayers, onlinePlayers],
//         backgroundColor: ['#FF6384', '#36A2EB'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB'],
//       },
//     ],
//   };

//   return (
//     <div className="log-container">
//       <div className="log-charts-container">
//         <div className="log-chart">
//           <h2>All-Devices</h2>
//           <Doughnut data={deviceData} />
//           <div className="chart-info">
//             <p style={{ color: '#FF6384' }}>Total Devices: {totalAccounts}</p>
//             <p style={{ color: '#36A2EB' }}>Online Devices: {onlineDevices}</p>
//           </div>
//         </div>
//         <div className="log-chart">
//           <h2>Admins</h2>
//           <Doughnut data={adminData} />
//           <div className="chart-info">
//             <p style={{ color: '#FF6384' }}>Total Admins: {totalAdmins}</p>
//             <p style={{ color: '#36A2EB' }}>Admins Online: {onlineAdmins}</p>
//           </div>
//         </div>
//         <div className="log-chart">
//           <h2>Players</h2>
//           <Doughnut data={playerData} />
//           <div className="chart-info">
//             <p style={{ color: '#FF6384' }}>Total Players: {totalPlayers}</p>
//             <p style={{ color: '#36A2EB' }}>Players Online: {onlinePlayers}</p>
//           </div>
//         </div>
//         <div className="log-chart">
//           <h2>Access</h2>
//           <ul>
//             {pictures.map((picture, index) => (
//               <li key={index}>
//                 <strong>Name:</strong> {picture.name}, <strong>Size:</strong> {picture.size} bytes
//               </li>
//             ))}
//           </ul>
//           <div className="chart-info">
//             <p>Total Access: {totalPictures}</p>
//             <p>Total Storage Used: {formattedTotalSize}</p>
//           </div>
//         </div>
//       </div>
//       <div>
//         <h2>Online Status</h2>
//         <ul>
//           {accounts.map(account => (
//             <li key={account.uid}>
//               {account.type === 'ADMIN' ? 'Admin' : 'Player'} {account.uid}: {otherMachineStatus[account.uid]?.state === 'online' ? 'Online' : 'Offline'}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// function calculateFileSize(bytes) {
//   const units = ['B', 'KB', 'MB', 'GB', 'TB'];
//   let i = 0;
//   while (bytes > 1024 && i < units.length - 1) {
//     bytes /= 1024;
//     ++i;
//   }
//   return `${bytes.toFixed(1)} ${units[i]}`;
// }

// export default Log;
import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getMetadata } from 'firebase/storage';
import { collection, query, onSnapshot, getFirestore } from 'firebase/firestore';
import './Style/Home.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const firestore = getFirestore();

const Log = ({ otherMachineStatus }) => {
  const [pictures, setPictures] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [onlineAdmins, setOnlineAdmins] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);

  useEffect(() => {
    const fetchPicturesMetadata = async () => {
      try {
        const storage = getStorage();
        const imagesRef = ref(storage, 'images');

        const imagesList = await listAll(imagesRef);

        const pictureMetadata = await Promise.all(imagesList.items.map(async (imageRef) => {
          const metadata = await getMetadata(imageRef);
          return {
            name: metadata.name,
            size: metadata.size,
          };
        }));

        const totalSize = pictureMetadata.reduce((acc, picture) => acc + picture.size, 0);

        setPictures(pictureMetadata);
        setTotalSize(totalSize);
      } catch (error) {
        console.error('Error fetching pictures metadata:', error);
      }
    };

    fetchPicturesMetadata();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsRef = collection(firestore, 'accounts');
        const q = query(accountsRef);
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const accountsData = querySnapshot.docs.map(doc => doc.data());
          setAccounts(accountsData);

          const onlineAdminsCount = accountsData.filter(account => account.type === 'ADMIN' && otherMachineStatus[account.uid]?.state === 'online').length;
          const onlinePlayersCount = accountsData.filter(account => account.type === 'PLAYER' && otherMachineStatus[account.uid]?.state === 'online').length;
          setOnlineAdmins(onlineAdminsCount);
          setOnlinePlayers(onlinePlayersCount);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [otherMachineStatus]);

  const totalPictures = pictures.length;
  const totalAdmins = accounts.filter(account => account.type === 'ADMIN').length;
  const totalPlayers = accounts.filter(account => account.type === 'PLAYER').length;
  const totalAccounts = accounts.length;
  const onlineDevices = onlineAdmins + onlinePlayers;
  const onlinePercentage = (onlineDevices / totalAccounts) * 100;
  const formattedTotalSize = calculateFileSize(totalSize);

  const deviceData = {
    labels: ['Online Devices', 'Offline Devices'],
    datasets: [
      {
        data: [onlineDevices, totalAccounts - onlineDevices],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const adminData = {
    labels: ['Admins Online', 'Admins Offline'],
    datasets: [
      {
        data: [onlineAdmins, totalAdmins - onlineAdmins],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const playerData = {
    labels: ['Players Online', 'Players Offline'],
    datasets: [
      {
        data: [onlinePlayers, totalPlayers - onlinePlayers],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="log-container">
      <div className="log-charts-container">
        <div className="log-chart">
          <h2>All-Devices</h2>
          <Doughnut data={deviceData} />
          <div className="chart-info">
            <p style={{ color: '#36A2EB' }}>Online Devices: {onlineDevices} ({onlinePercentage.toFixed(1)}%)</p>
            <p style={{ color: '#FF6384' }}>Total Devices: {totalAccounts}</p>
          </div>
        </div>
        <div className="log-chart">
          <h2>Admins</h2>
          <Doughnut data={adminData} />
          <div className="chart-info">
            <p style={{ color: '#36A2EB' }}>Admins Online: {onlineAdmins} ({((onlineAdmins / totalAdmins) * 100).toFixed(1)}%)</p>
            <p style={{ color: '#FF6384' }}>Total Admins: {totalAdmins}</p>
          </div>
        </div>
        <div className="log-chart">
          <h2>Players</h2>
          <Doughnut data={playerData} />
          <div className="chart-info">
            <p style={{ color: '#36A2EB' }}>Players Online: {onlinePlayers} ({((onlinePlayers / totalPlayers) * 100).toFixed(1)}%)</p>
            <p style={{ color: '#FF6384' }}>Total Players: {totalPlayers}</p>
          </div>
        </div>
        <div className="log-chart">
          <h2>Access</h2>
          <ul>
            {pictures.map((picture, index) => (
              <li key={index}>
                <strong>Name:</strong> {picture.name}, <strong>Size:</strong> {picture.size} bytes
              </li>
            ))}
          </ul>
          <div className="chart-info">
            <p>Total Access: {totalPictures}</p>
            <p>Total Storage Used: {formattedTotalSize}</p>
          </div>
        </div>
      </div>
      <div className="home-container">
        <h2>Online Status</h2>
        <ul>
          {accounts.map(account => (
            <li key={account.uid}>
              {account.type === 'ADMIN' ? 'Admin' : 'Player'} {account.uid}: {otherMachineStatus[account.uid]?.state === 'online' ? 'Online' : 'Offline'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function calculateFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes > 1024 && i < units.length - 1) {
    bytes /= 1024;
    ++i;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

export default Log;
