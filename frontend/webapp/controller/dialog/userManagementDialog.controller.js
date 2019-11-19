sap.ui.define([
    "../ControllerBase",
    "sap/ui/model/json/JSONModel",
    "com/app/manager/Formatter"
], function (Controller, JSONModel, Formatter) {
    "use strict";

    var Controller = Controller.extend("com.app.controller.dialog.userManagementDialog", {
        formatter: Formatter
    }),
        ControllerProto = Controller.prototype;

    
    ControllerProto.onInit = function() {
        
    };

    ControllerProto.onOpenInDialog = function(oSettings) {
        this.m_oSettings = oSettings;

        var aAllRoles = oSettings.allRoles,
            oUser = oSettings.user;
        aAllRoles.forEach((oRole) => {

            var aUserRoles = Object.keys(oUser.roles),
                bHasRole = false;
            aUserRoles.forEach((sUserRoleId) => {
                if (oRole.id === sUserRoleId) {
                    bHasRole = true;
                }
            });

            //add role to users role, is he doen't have it already
            if (!bHasRole) {
                oUser.roles[oRole.id] = {
                    hasRole: false
                };
            }
        });



        this.getView().setModel(new JSONModel({
            user: oUser,
            allRoles: aAllRoles
        }));
    };


    // --------------------------
    // Core Functionality
    // --------------------------


    // --------------------------
    // Formatter
    // --------------------------

    ControllerProto.formatLastModified = function(oDate) {
        if (!oDate) {
            return "";
        }

        return this.getOwnerComponent().getResourceBundle().getText(
            "userManagementDialog-lastModified",
            [Formatter.fromNow(oDate)]
        );
    };

    // --------------------------
    // Event Handlers
    // --------------------------

    /**
     * Triggered, when changes to a user should be saved
     * @param {object} oUser
     * @public
     */
    ControllerProto.onSubmitButtonPress = function() {
        var oUser = this.getView().getModel().getProperty("/user");

        this.getOwnerComponent().getUserManager().updateUserRoles({
            user: oUser,
            success: (oData) => {
                this.m_oSettings.onUpdateRolesSuccess(oData);
            },
            complete: () => {
                
            },
        });

        return true;
    }


    return Controller;
});