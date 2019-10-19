const admin = require("firebase-admin")



/**
 * Get's all users in chunks of 1000
 * @param {string} sPageToken - the token for the page
 * @returns {array}
 * @public
 */
exports.getAllUsers = async function(sPageToken) {
    var oUsersListResult = await admin.auth().listUsers(1000, sPageToken),
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

    return aUsers;
}