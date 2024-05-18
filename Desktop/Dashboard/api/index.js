const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('./digitalsignage-21521774-firebase-adminsdk-1c4hp-2b39253bff.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/your-endpoint', async (req, res) => {
  try {
    // Example Firebase call
    const db = admin.firestore();
    const doc = await db.collection('your-collection').doc('your-doc').get();
    if (!doc.exists) {
      return res.status(404).send('Document not found');
    }
    res.status(200).send(doc.data());
  } catch (error) {
    console.error('Function invocation failed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
