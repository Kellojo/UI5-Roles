const admin = require("firebase-admin")



/**
 * Get's all roles
 * @returns {array}
 * @public
 */
exports.getAllRoles = async function() {
    var oQuerySnapshot = await admin.firestore().collection("roles").get(),
    aRoles = [];

    oQuerySnapshot.docs.forEach((oDocument) => {
        var oRole = oDocument.data();
        oRole.id = oDocument.id;
        aRoles.push(oRole);
    });

    return aRoles;
}