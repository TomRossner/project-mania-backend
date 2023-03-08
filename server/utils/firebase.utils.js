const admin = require('firebase-admin');
const serviceAccount = require("../../projectmania-e73ae-firebase-adminsdk-hcn09-4c2d89f6b3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function decodeToken(token) {
    return await admin.auth().verifyIdToken(token);
}

module.exports = {
    decodeToken
}