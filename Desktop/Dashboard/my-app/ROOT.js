const admin = require('firebase-admin');

const serviceAccount = require('./src/YOUR FILE.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = 'jePIVqgnCcYEiNo0wUcNoLnKaOo2'; 

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('User is now an admin');
  })
  .catch((error) => {
    console.error('Error setting custom claims:', error);
  });
