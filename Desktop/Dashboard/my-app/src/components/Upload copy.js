// import React, { useState, useEffect } from 'react';
// import { collection, onSnapshot } from 'firebase/firestore'; // Import Firestore's collection and onSnapshot
// import { getFirestore } from 'firebase/firestore'; // Import getFirestore

// const firestore = getFirestore(); // Initialize Firestore

// const Upload = ({ imageUpload, setImageUpload, uploadFile }) => {
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   // useEffect to subscribe to real-time updates from Firestore
//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(firestore, 'uploads'), (snapshot) => {
//       console.log('Received Firestore update:', snapshot.docs.map((doc) => doc.data()));
//       // Add your logic here to handle the received updates
//     });

//     // Clean up function to unsubscribe when component unmounts
//     return () => {
//       unsubscribe();
//     };
//   }, []); // Empty dependency array to only subscribe once on component mount

//   const handleFileUpload = async () => {
//     if (!imageUpload) return;
//     setIsUploading(true); // Set uploading state
//     try {
//       await uploadFile(); // Call the upload function
//       setPreviewUrl(null); // Clear preview after successful upload
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     } finally {
//       setIsUploading(false); // Reset uploading state
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setImageUpload(file);

//     const reader = new FileReader();
//     reader.onload = (e) => setPreviewUrl(e.target.result);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Screen</h2>
//       <div className="upload-field">
//         <input type="file" onChange={handleFileChange} />
//         {previewUrl && <img src={previewUrl} alt="Uploaded Image Preview" />}
//       </div>
//       <button
//         className="upload-button"
//         onClick={handleFileUpload}
//         disabled={isUploading}
//       >
//         {isUploading ? 'Uploading...' : 'Upload Image'}
//       </button>
//     </div>
//   );
// };

// export default Upload;
// import React, { useState, useEffect } from 'react';
// import { collection, onSnapshot } from 'firebase/firestore';
// import { getFirestore } from 'firebase/firestore';
// import { storage } from '../firebaseConfig';
// import { uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';

// const firestore = getFirestore();

// const Upload = ({ imageUpload, setImageUpload, uploadFile }) => {
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isActive, setIsActive] = useState(true); // New state for activation status

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(firestore, 'uploads'), (snapshot) => {
//       console.log('Received Firestore update:', snapshot.docs.map((doc) => doc.data()));
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const handleFileUpload = async () => {
//     if (!imageUpload) return;
//     setIsUploading(true);

//     try {
//       await uploadFile();
//       setPreviewUrl(null);
//       setIsActive(true); // Reset activation status after successful upload
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setImageUpload(file);

//     const reader = new FileReader();
//     reader.onload = (e) => setPreviewUrl(e.target.result);
//     reader.readAsDataURL(file);
//   };

//   const toggleActivation = () => {
//     setIsActive(!isActive); // Toggle activation status
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Screen</h2>
//       <div className="upload-field">
//         <input type="file" onChange={handleFileChange} />
//         {previewUrl && <img src={previewUrl} alt="Uploaded Image Preview" />}
//       </div>
//       <div className="activation-toggle">
//         <label htmlFor="activationToggle">Active:</label>
//         <input type="checkbox" id="activationToggle" checked={isActive} onChange={toggleActivation} />
//       </div>
//       <button className="upload-button" onClick={handleFileUpload} disabled={isUploading}>
//         {isUploading ? 'Uploading...' : 'Upload Image'}
//       </button>
//     </div>
//   );
// };

// export default Upload;
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { storage } from '../firebaseConfig';
import { uploadBytes, getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import './GalleryWithUpload.css';
const firestore = getFirestore();

const Upload = ({ imageUpload, setImageUpload, uploadFile }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isActive, setIsActive] = useState(true); // New state for activation status
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'pins'), (snapshot) => {
      const urls = snapshot.docs.map(doc => ({ id: doc.id, url: doc.data().imageUrl }));
      setImageUrls(urls);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleFileUpload = async () => {
    if (!imageUpload) return;
    setIsUploading(true);

    try {
      await uploadFile();
      setPreviewUrl(null);
      setIsActive(true); // Reset activation status after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageUpload(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const toggleActivation = () => {
    setIsActive(!isActive); // Toggle activation status
  };

  const handleDelete = async (imageUrl, imageId) => {
    try {
      // Delete document from Firestore
      await deleteDoc(doc(firestore, 'pins', imageId));
  
      // Extract file ID from image URL (modify if necessary)
      const fileId = imageUrl.split('?')[0].split('/').pop();

  
      // Create a reference to the file in Storage
      const imageRef = ref(storage, `images/${fileId}`); // Assuming path starts with "images/"
  
      // Delete the file from Storage
      await deleteObject(imageRef).then(() => {
        console.log('File deleted successfully');
      }).catch((error) => {
        console.error('Error deleting image:', error);
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      // Check for specific errors like "not found"
    }
  };
  return (
    <div>
      <div className="gallery">
        <h2>Gallery</h2>
        <div className="image-list">
          {imageUrls.map(({ id, url }) => (
            <div key={id} className="image-item">
              <img src={url} alt="Uploaded" />
              {/* <button onClick={() => handleDelete(url, id)}>Delete</button> */}
            </div>
          ))}
        </div>
      </div>

      <div className="upload-container">
        <h2>Upload</h2>
        <div className="upload-field">
          <input type="file" onChange={handleFileChange} />
          {previewUrl && <img src={previewUrl} alt="Uploaded Image Preview" />}
        </div>
        <div className="activation-toggle">
          <label htmlFor="activationToggle">Active:</label>
          <input type="checkbox" id="activationToggle" checked={isActive} onChange={toggleActivation} />
        </div>
        <button className="upload-button" onClick={handleFileUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
};

export default Upload;
