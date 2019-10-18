/**
 * Handles /roles/ requests
 * 
 * @author Daniel Fritz 
 */

const admin = require("firebase-admin")
const express = require("express")
var router = express.Router();





/**
 * Get's all routers
 * @public 
 */
router.get("/", async (request, response, next) => {
    var oQuerySnapshot = await admin.firestore().collection("roles").get(),
    aRoles = [];
    
    oQuerySnapshot.docs.forEach((oDocument) => {
        var oRole = oDocument.data();
        oRole.id = oDocument.id;
        aRoles.push(oRole);
    });

    response.json({
        allRoles: aRoles
    });
});


module.exports = router;