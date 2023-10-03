const functions = require("firebase-functions");
const admin = require("firebase-admin");

const initApp = () => {
  admin.initializeApp({});
};

const getDB = () => {
  return admin.firestore();
};

const getAPI = (main) => {
  return functions.https.onRequest(main);
};

module.exports = { initApp, getDB, getAPI };
