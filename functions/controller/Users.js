const admin = require("firebase-admin")


/**
 * Get's the user details for a given user id
 * returns an empty one, if not present
 * @param {string} sUserId
 * @returns {object}
 */
exports.getUserDetails = async function(sUserId) {
    var oQuerySnapshot = await admin.firestore().collection("users").doc(sUserId).get();

    if (oQuerySnapshot.exists) {
        return oQuerySnapshot.data();
    } else {
        return {
            roles: {},
            lastModifiedAt: null
        }
    }
}

/**
 * Get's all users in chunks of 1000
 * @param {string} sPageToken - the token for the page
 * @returns {object}
 * @public
 */
exports.getAllUsers = async function(sPageToken) {
    var oUsersListResult = await admin.auth().listUsers(50, sPageToken);
    
    const aPromises = oUsersListResult.users.map(async (oUser) => {
        var oUserDetails = await this.getUserDetails(oUser.uid);

        return {
            uid: oUser.uid,
            email: oUser.email,
            emailVerified: oUser.emailVerified,
            creationTime: oUser.metadata.creationTime,
            displayName: oUser.displayName,
            disabled: oUser.disabled,
            ...oUserDetails
        };
    });

    return {
        users : await Promise.all(aPromises),
        nextPageToken: oUsersListResult.pageToken,
    }
}