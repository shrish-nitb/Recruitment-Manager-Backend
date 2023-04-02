var admin = require("firebase-admin");

// Fetch the service account key JSON file contents since Running on LOCALSERVER
var serviceAccount = require("./recruit-ecell-firebase-adminsdk-splyq-69e2074477.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.db = admin.firestore();
