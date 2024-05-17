const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');  // Import the cors package
const serviceAccount = require('.digitalsignage-21521774-firebase-adminsdk-1c4hp-2b39253bff.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());  // Use the cors middleware
app.use(express.json());

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
