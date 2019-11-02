sap.ui.define([
    "com/app/manager/BeanBase",
    "./Config"
], function (BeanBase, Config) {
    "use strict";

    var Manager = BeanBase.extend("com.app.manager.RestClient", {}),
        ManagerProto = Manager.prototype;

    ManagerProto.onInit = function () {

        //init firestore
        this.firestore = firebase.firestore();
        var settings = {
            timestampsInSnapshots: true
        };
        this.firestore.settings(settings);
    };


    // ----------------------
    // Requests
    // ----------------------


    /**
     * Performs a get request
     * @public
     */
    ManagerProto.getRequest = function(oRequest) {
        var fnSendRequest = (sIdToken) => {
            console.log('Performing GET request to "' + oRequest.url + '"');

            jQuery.ajax({
                url: this._determineRequestUrl(oRequest),
                data: oRequest.parameters,
                headers: {
                    Authorization: "Bearer " + sIdToken
                },
                success: oRequest.success,
                error: this._generateErrorHandler(oRequest.error),
                complete: oRequest.complete,
            });
        };

        this._applyFirebaseIdTokenToRequest(fnSendRequest);
    };

    /**
     * Performs a post request
     * @public
     */
    ManagerProto.postRequest = function(oRequest) {
        var fnSendRequest = (sIdToken) => {
            console.log('Performing POST request to "' + oRequest.url + '"');

            jQuery.ajax({
                method: "POST",
                data: JSON.stringify(oRequest.data),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: this._determineRequestUrl(oRequest),
                headers: {
                    Authorization: "Bearer " + sIdToken
                },

                success: oRequest.success,
                error: this._generateErrorHandler(oRequest.error),
                complete: oRequest.complete,
            });
        }

        this._applyFirebaseIdTokenToRequest(fnSendRequest);
    };

    /**
     * Calls the fnSendRequest function, with the firebase id token of the user, after getting the token
     * @param {function} fnSendRequest - the function that sends off the request
     * @protected
     */
    ManagerProto._applyFirebaseIdTokenToRequest = function(fnSendRequest) {
        //send off request after getting firebase id token
        if (this.getOwnerComponent().getUserManager().isLoggedIn()) {
            firebase.auth().currentUser.getIdToken()
                .then(fnSendRequest)
                .catch(fnSendRequest);
        } else {
            fnSendRequest();
        }
    };

    // ----------------------
    // Utility
    // ----------------------

    /**
     * Determines the request url based on the request key given
     */
    ManagerProto._determineRequestUrl = function(oRequest) {
        var sUrl = oRequest.url,
            aPathParameters = Object.keys(oRequest.pathParameters || {});

        aPathParameters.forEach((sKey) => {
            sUrl = sUrl.replace("{" + sKey + "}", oRequest.pathParameters[sKey]);
        });

        return Config.BACKEND_BASE_URL + sUrl;
    };
    
    /**
     * Creates an error handler for a custom error function
     * @protected
     */
    ManagerProto._generateErrorHandler = function (fnCustomError) {
        return function (error) {
            var sMessage = error.message || error.responseText;
            this.getOwnerComponent().showErrorMessage(sMessage);

            if (fnCustomError) {
                fnCustomError();
            }
        }.bind(this);
    };

    return Manager;
});