const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


const app = require("./app");
exports.api = functions.https.onRequest(app);