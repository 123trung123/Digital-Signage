import React, { useState } from 'react';

const Upload = ({ imageUpload, setImageUpload, uploadFile, user }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    if (!imageUpload || !user) return;
    setIsUploading(true); // Set uploading state
    try {
      await uploadFile(user.uid); // Pass user UID to the upload function
      setPreviewUrl(null); // Clear preview after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageUpload(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="upload-container">
      <h2>Upload Screen</h2>
      <div className="upload-field">
        <input type="file" onChange={handleFileChange} />
        {previewUrl && <img src={previewUrl} alt="Uploaded Image Preview" />}
      </div>
      <button
        className="upload-button"
        onClick={handleFileUpload}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default Upload;
