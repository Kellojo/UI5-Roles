sap.ui.define([
    "com/app/manager/BeanBase",
    "sap/ui/model/json/JSONModel"
], function (BeanBase, JSONModel) {
    "use strict";

    var Manager = BeanBase.extend("com.app.manager.UserManager", {
        metadata: {
            properties: {
                currentUser: {
                    type: "object"
                }
            },
            events: {
                authStateChanged: {
                    parameters: {
                        user: {type: "object"}
                    }
                }
            }
        }
    }),
        ManagerProto = Manager.prototype;

    ManagerProto.onInit = function () {

        //init user model
        this.m_oCurrentUser = null;
        this.m_oUserModel = new JSONModel({
            user: null
        });
        this.getOwnerComponent().setModel(this.m_oUserModel, "userModel");

        //init firestore
        this.firestore = firebase.firestore();
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
    };


    // -----------------------------
    // Event Handling
    // -----------------------------

    ManagerProto.onAuthStateChanged = function (oUser) {
        this.m_oUserModel.setProperty("/user", oUser);
        this.m_oUserModel.refresh(true);
        this.m_oCurrentUser = oUser;
        this.setProperty("currentUser", oUser);

        this.fireAuthStateChanged({
            user: oUser
        });
    };

    // -----------------------------
    // User Specific Functions
    // -----------------------------

    ManagerProto.login = function(email, password, then, error, complete) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(then)
            .catch(this.getOwnerComponent().getRestClient()._generateErrorHandler(error))
            .finally(complete);
    };

    ManagerProto.signUp = function(email, password, then, error, complete) {
         firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(then)
            .catch(this.getOwnerComponent().getRestClient()._generateErrorHandler(error))
            .finally(complete);
    };

    ManagerProto.logout = function (error) {
        firebase.auth().signOut().catch(function (error) {
            if (error) {
                error(error);
            }
        });
    };

    ManagerProto.sendPasswordResetEmail = function (mParameters) {
        firebase.auth().sendPasswordResetEmail(mParameters.email).then(function () {
            if (typeof mParameters.success === "function") {
                mParameters.success();
            }
        }).catch(this.getOwnerComponent().getRestClient()._generateErrorHandler(mParameters.error));
    };

    ManagerProto.isLoggedIn = function() {
        return !!firebase.auth().currentUser;
    };

    /**
     * Checks, if the given user has any roles
     * @param {user object} oUser
     * @returns {boolean}  
     */
    ManagerProto.hasAnyRoles = function(oUser) {
        var aRoles = Object.keys(oUser.roles),
            bHasAnyRoles = false;
        aRoles.forEach((sRole) => {
            if (oUser.roles[sRole].hasRole) {
                bHasAnyRoles = true;
            }
        });

        return bHasAnyRoles;
    };

    // -----------------------------
    // User Management Functions
    // -----------------------------

    /**
     * Reads all available users (in chunks of 1000 users)
     * @param {object} oRequest
     * @public
     */
    ManagerProto.readAllUsers = function(oRequest) {
        oRequest.url = "users";
        oRequest.parameters = {
            nextPageToken: oRequest.nextPageToken
        }
        this.getOwnerComponent().getRestClient().getRequest(oRequest);
    };

    /**
     * Updates the roles of a user
     * @param {object} oRequest
     * @public
     */
    ManagerProto.updateUserRoles = function(oRequest) {
        oRequest.url = "users/{userId}/roles";
        oRequest.data = oRequest.user;
        oRequest.pathParameters = {
            userId: oRequest.user.uid
        };
        this.getOwnerComponent().getRestClient().postRequest(oRequest);
    };

    /**
     * Sorter function for users
     * @param {object} oUser1
     * @param {object} oUser2 
     * @returns {number} 
     */
    ManagerProto.sortUsers = function(oUser1, oUser2) {
        var bHasAnyRoles1 = this.getOwnerComponent().getUserManager().hasAnyRoles(oUser1),
            bHasAnyRoles2 = this.getOwnerComponent().getUserManager().hasAnyRoles(oUser2);

        if (bHasAnyRoles1 && !bHasAnyRoles2) {
            return -1;
        } else if (bHasAnyRoles2 && !bHasAnyRoles1) {
            return 1;
        } else if (!bHasAnyRoles1 && !bHasAnyRoles2) {
            if (oUser1.lastModifiedAt && !oUser2.lastModifiedAt) {
                return -1;
            } else if (!oUser1.lastModifiedAt && oUser2.lastModifiedAt) {
                return 1;
            } else if (oUser1.lastModifiedAt && oUser2.lastModifiedAt) {
                return oUser2.lastModifiedAt._seconds - oUser1.lastModifiedAt._seconds;
            }
            return 0;
        } else if (bHasAnyRoles2 && bHasAnyRoles1) {
            return oUser2.lastModifiedAt._seconds - oUser1.lastModifiedAt._seconds;
        }

        return 0;
    };

    return Manager;
});