const admin = require('firebase-admin');
const serviceAccount = require("../../projectmania-e73ae-firebase-adminsdk-hcn09-4c2d89f6b3.json");

// Initialize
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Decode Access Token
async function decodeToken(token) {
    return await admin.auth().verifyIdToken(token);
}

// Exports
module.exports = {
    decodeToken
}