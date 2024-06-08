import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { storage } from '../../firebaseconfig-key/firebaseConfig';
import { ref, deleteObject } from 'firebase/storage';
import '../../components/Style/Assets.css';
const firestore = getFirestore();

const Upload = ({ imageUpload, setImageUpload, uploadFile, uuid,type }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isActive, setIsActive] = useState(true); 
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'pins'), (snapshot) => {
      const urls = snapshot.docs.map(doc => ({ id: doc.id, url: doc.data().imageUrl, type:doc.data().type }));
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
      setIsActive(true);
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
    setIsActive(!isActive); 
  };

  const handleDelete = async (imageUrl, imageId, uuid) => {
    try {
      await deleteDoc(doc(firestore, 'pins', imageId));
  
      // const fileName = imageUrl.split('/').pop().split('?')[0];
  
      // const fileIdWithUUID = `${fileName}-${uuid}`;
  
      // const imageRef = ref(storage, `images/${fileIdWithUUID}`);

const decodedUrl = decodeURIComponent(imageUrl);

const fileName = decodedUrl.split('/').pop().split('?')[0];

const fileIdWithUUID = `${fileName}`;

  	const imageRef = ref(storage, `images/${fileIdWithUUID}`);
      await deleteObject(imageRef).then(() => {
        console.log('File deleted successfully');
      }).catch((error) => {
        console.error('Error deleting image:', error);
      });
    const videoRef = ref(storage, `videos/${fileIdWithUUID}`);
    await deleteObject(videoRef).then(() => {
      console.log('Video file deleted successfully');
    }).catch((error) => {
      console.error('Error deleting video file:', error);
    });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  
  return (
    <div>
      <div className="gallery">
        <h2>Gallery</h2>
        <div className="image-list">
          {imageUrls.map(({ id, url, type }) => (
          <div key={id} className="image-item">
            {type === "image" ? (
              <img src={url} alt="Uploaded" />
            ) : (
              <video src={url} controls />
            )}
            <button onClick={() => handleDelete(url, id, uuid)}>Delete</button>
          </div>
          ))}
        </div>
      </div>

      <div className="upload-container">
        <h2>Upload</h2>
        <div className="upload-field">
          <input type="file" onChange={handleFileChange} />
          {previewUrl && <img src={previewUrl} alt="Uploaded" />}
        </div>
        {/* <div className="activation-toggle">
          <label htmlFor="activationToggle">Active:</label>
          <input type="checkbox" id="activationToggle" checked={isActive} onChange={toggleActivation} />
        </div> */}
        <button className="upload-button" onClick={handleFileUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Asset'}
        </button>
      </div>
    </div>
  );
};

export default Upload;
