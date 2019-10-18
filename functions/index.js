const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


const app = require("./app");
exports.api = functions.https.onRequest(app);




/**
 * Fired When a user is being created
 * @public  
 */
exports.onUserCreate = functions.auth.user().onCreate(async (oUser) => {
    var oQuerySnapshot = await admin.firestore().collection("roles").get(),
        aRoles = [];
        
    oQuerySnapshot.docs.forEach((oDocument) => {
        var oRole = oDocument.data();
        oRole.id = oDocument.id;
        aRoles.push(oRole);
    });

    var oRoles = {};
    aRoles.forEach((oRole) => {
        oRoles[oRole.id] = {
            hasRole: !!hasRoleByDefault
        };
    });

    admin.firestore().collection("users").doc(oUser.uid).set({
        roles: oRoles,
        lastModifiedAt: null,
        createdAt: new Date(),
    });
});

/**
 * Fired When a user is being deleted
 * @public  
 */
exports.onUserDelete = functions.auth.user().onDelete(async (oUser) => {
    admin.firestore().collection("users").doc(oUser.uid).delete();
});