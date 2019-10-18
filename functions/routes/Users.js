/**
 * Handles /users/ requests
 * 
 * @author Daniel Fritz 
 */

const admin = require("firebase-admin")
const express = require("express") 
const rolesController = require("../controller/Roles")
var router = express.Router();





/**
 * Get's all users
 * @public 
 */
router.get("/", async (request, response, next) => {
    var oUsersListResult = await admin.auth().listUsers(1000, request.params.nextPageToken),
        aUsers = [];
    
    oUsersListResult.users.forEach((oUser) => {
        aUsers.push({
            uid: oUser.uid,
            email: oUser.email,
            emailVerified: oUser.emailVerified,
            creationTime: oUser.metadata.creationTime,
            displayName: oUser.displayName,
            disabled: oUser.disabled,

            roles: {
                admin: {
                    hasRole: true
                },
                viewer: {
                    hasRole: false
                }
            }
        });
    });

    response.json({
        results: aUsers,
        count: aUsers.length
    });
});


module.exports = router;