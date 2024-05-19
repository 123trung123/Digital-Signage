const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
// const serviceAccount = require('./digitalsignage-21521774-firebase-adminsdk-1c4hp-2b39253bff.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const app = express();
app.use(cors());
app.use(express.json());

// Simple endpoint to verify the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Endpoint to grant admin privileges
app.post('/grantAdmin', async (req, res) => {
  const { uid } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.status(200).send({ message: 'Admin privileges granted successfully' });
  } catch (error) {
    console.error('Error setting custom claims:', error);
    res.status(500).send({ error: 'Error granting admin privileges' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
