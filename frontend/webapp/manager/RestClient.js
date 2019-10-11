sap.ui.define([
    "com/app/manager/BeanBase",
    "sap/ui/model/json/JSONModel"
], function (BeanBase, JSONModel) {
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


    ManagerProto.generateErrorHandler = function (fnCustomError) {
        return function (error) {
            this.getOwnerComponent().showErrorMessage(error.message);

            if (fnCustomError) {
                fnCustomError();
            }
        }.bind(this);
    };

    return Manager;
});