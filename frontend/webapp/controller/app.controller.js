sap.ui.define([
    "./ControllerBase",
    "sap/ui/model/json/JSONModel",
    "com/app/manager/Formatter"
], function (Controller, JSONModel, Formatter) {
    "use strict";

    var Controller = Controller.extend("com.app.controller.app", {
        
    }),
        ControllerProto = Controller.prototype;

    
    ControllerProto.onInit = function() {
        this.m_oErrorMessageContainer = this.getView().byId("idErrorMessageContainer");

        var oComponent = this.getOwnerComponent();
        oComponent.m_oErrorMessageContainer = this.m_oErrorMessageContainer;
    };

    return Controller;
});