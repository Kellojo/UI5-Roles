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
            url: this._determineRequestUrl(oRequest.url),
            success: oRequest.success,
            error: this._generateErrorHandler(oRequest.error),
            complete: oRequest.complete,
        });
    };

    /**
     * Determines the request url based on the request key given
     */
    ManagerProto._determineRequestUrl = function(sPath) {
        return Config.BACKEND_BASE_URL + sPath;
    };

    return Manager;
});