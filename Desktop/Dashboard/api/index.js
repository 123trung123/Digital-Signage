const { json } = require('micro');
const admin = require('firebase-admin');
const cors = require('micro-cors')(); 
const serviceAccount = require('../digitalsignage-21521774-firebase-adminsdk-1c4hp-2b39253bff.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = cors((req, res) => {
  if (req.method === 'GET') {
    res.end('Server is running');
  } else {
    res.status(405).end(); 
  }
});
