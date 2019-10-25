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


    /**
     * Creates an error handler for a custom error function
     * @protected
     */
    ManagerProto._generateErrorHandler = function (fnCustomError) {
        return function (error) {
            this.getOwnerComponent().showErrorMessage(error.message);

            if (fnCustomError) {
                fnCustomError();
            }
        }.bind(this);
    };

    /**
     * Performs a get request
     * @public
     */
    ManagerProto.getRequest = function(oRequest) {
        console.log('Performing GET request to "' + oRequest.url + '"');

        jQuery.ajax({
            url: this._determineRequestUrl(oRequest),
            success: oRequest.success,
            error: this._generateErrorHandler(oRequest.error),
            complete: oRequest.complete,
        });
    };

    /**
     * Performs a post request
     * @public
     */
    ManagerProto.postRequest = function(oRequest) {
        console.log('Performing POST request to "' + oRequest.url + '"');

        jQuery.ajax({
            method: "POST",
            data: JSON.stringify(oRequest.data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: this._determineRequestUrl(oRequest),

            success: oRequest.success,
            error: this._generateErrorHandler(oRequest.error),
            complete: oRequest.complete,
        });
    };

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

    return Manager;
});