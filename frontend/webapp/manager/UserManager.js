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

        });
    };

    // -----------------------------
    // User Specific Functions
    // -----------------------------

    ManagerProto.login = function login(email, password, fnThen, error, complete) {
        var oRequest = firebase.auth().signInWithEmailAndPassword(email, password);

        oRequest.then(fnThen);
        oRequest.catch(this.getOwnerComponent().getRestClient().generateErrorHandler(error));
        oRequest.finally(complete);
    };

    ManagerProto.registerUser = function (email, password, fnThen, error, complete) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(this.getOwnerComponent().getRestClient().generateErrorHandler(error))
            .then(fnThen)
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
        }).catch(this.getOwnerComponent().getRestClient().generateErrorHandler(mParameters.error));
    };

    ManagerProto.isLoggedIn = function() {
        return !!firebase.auth().currentUser;
    };

    return Manager;
});