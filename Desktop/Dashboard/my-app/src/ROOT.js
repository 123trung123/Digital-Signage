const admin = require('firebase-admin');

// Initialize Firebase Admin with service account credentials
const serviceAccount = require('./src/digitalsignage-21521774-firebase-adminsdk-1c4hp-87cd1bef04.json'); // Path to your service account file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = 'V5bMHhP5QBYnF1DP6JviqiLqh882'; // UID of the user you want to make admin

// Set custom claims to designate user as admin
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('User is now an admin');
  })
  .catch((error) => {
    console.error('Error setting custom claims:', error);
  });
