const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./YOUR FILE.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://digitalsignage-21521774-default-rtdb.asia-southeast1.firebasedatabase.app' // Replace with your database URL
});

const db = admin.firestore();

// Endpoint to create an account
app.post('/api/create-account', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    await db.collection('accounts').doc(userRecord.uid).set({
      email: email
    });

    res.status(200).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to delete an account
app.delete('/api/delete-account/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    await admin.auth().deleteUser(uid);
    await db.collection('accounts').doc(uid).delete();
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
