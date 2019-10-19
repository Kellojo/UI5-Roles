/**
 * Handles /users/ requests
 * 
 * @author Daniel Fritz 
 */

const admin = require("firebase-admin")
const express = require("express")
var router = express.Router();

const UserController = require("../controller/Users");
const RolesController = require("../controller/Roles");



/**
 * Get's all users & available roles
 * @public 
 */
router.get("/", async (request, response, next) => {
    var aUsers = UserController.getAllUsers(),
        aRoles = RolesController.getAllRoles();

    response.json({
        results: await aUsers,
        allRoles: await aRoles
    });
});



router.post("/:userId/roles/", async (request, response, next) => {
    var sUserId = request.params.userId,
        oUser = request.body.user,
        oRoles = {};
    if (!sUserId) {
        response.statusCode = 500;
        response.statusMessage = "User id has to be valid";
        response.send();
        return;
    }
    if (!oUser) {
        response.statusCode = 500;
        response.statusMessage = "User has to be valid";
        response.send();
        return;
    }

    //get all available roles and filter the ones sent from the client
    var oQuerySnapshot = await admin.firestore().collection("roles").get(),
        aRoles = [];
    
    oQuerySnapshot.docs.forEach((oDocument) => {
        var oRole = oDocument.data();
        oRole.id = oDocument.id;
        aRoles.push(oRole);
    });


    //validate client roles
    /*aRoles.forEach((oRole) => {
        var sRoleId = oRole.id;

        oRoles[sRoleId] = {
            hasRole: oUser.roles[sRoleId],      //security check should go here
        }
    });*/


    //save client roles
    var oUserDocument = {
        roles: oRoles,
        lastModifiedAt: new Date(),
    },
        oQuerySnapShot = await admin.firestore().collection("users").doc(sUserId).set(oUserDocument);
    response.json(oUserDocument);
});


module.exports = router;