const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.verifyAdmin = functions.https.onRequest(async (request, response) => {
  const idToken = request.body.idToken;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const isAdmin = decodedToken.claims.admin;
    response.json({ isAdmin });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    response.status(500).send('Error verifying token');
  }
});
