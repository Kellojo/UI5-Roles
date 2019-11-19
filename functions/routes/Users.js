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
    var oAllUsers = UserController.getAllUsers(request.query.nextPageToken),
        aRoles = RolesController.getAllRoles();
    oAllUsers = await oAllUsers;

    response.json({
        results: oAllUsers.users,
        nextPageToken: oAllUsers.nextPageToken,
        allRoles: await aRoles,
    });
});



router.post("/:userId/roles/", async (request, response, next) => {
    var sUserId = request.params.userId,
        oUser = request.body,
        oRoles = {};
    if (!sUserId || !oUser) {
        response.status(400).send();
        return;
    }

    //get all available roles and filter the ones sent from the client
    var aRoles = await RolesController.getAllRoles();

    //validate client roles
    for (let i = 0; i < aRoles.length; i++) {
        const oRole = aRoles[i],
            sRoleId = oRole.id,
            bHasRole = !!(oUser.roles && oUser.roles[sRoleId] && oUser.roles[sRoleId].hasRole);

        oRoles[sRoleId] = {
            hasRole: bHasRole, //security check should go here
        }
    }


    //save client roles
    var oUserDocument = {
        roles: oRoles,
        lastModifiedAt: new Date(),
    },
        oQuerySnapShot = await admin.firestore().collection("users").doc(sUserId).set(oUserDocument);

    oUser.roles = oUserDocument.roles;
    oUser.lastModifiedAt = oUserDocument.lastModifiedAt;
    response.json(oUser);
});


module.exports = router;