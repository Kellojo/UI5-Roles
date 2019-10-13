sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/app/manager/Formatter"
], function (Controller, JSONModel, Formatter) {
    "use strict";

    var Controller = Controller.extend("com.app.controller.userManagement", {
        
    }),
        ControllerProto = Controller.prototype;

    
    ControllerProto.onInit = function() {
        this.m_oUsersModel = new JSONModel({
            users: [],
            userCount: 0,
            isLoadingUsers: false,
        });
        this.getView().setModel(this.m_oUsersModel);

        this.loadUsers();
    };


    // --------------------------
    // Core Functionality
    // --------------------------

    /**
     * Loads all users
     * @public
     */
    ControllerProto.loadUsers = function() {
        this.m_oUsersModel.setProperty("/isLoadingUsers", true);
        this.getOwnerComponent().getUserManager().readAllUsers({
            success: (oData) => {
                this.m_oUsersModel.setProperty("/users", oData.results);
                this.m_oUsersModel.setProperty("/userCount", oData.count);
            },
            complete: () => {
                this.m_oUsersModel.setProperty("/isLoadingUsers", false);
            },
        });
    };

    // --------------------------
    // Event Handlers
    // --------------------------

    /**
     * Triggered, when a user list item is pressed by the user
     * @param {object} oEvent
     * @public
     */
    ControllerProto.onUserItemPress = function(oEvent) {
        var sPath = oEvent.getParameter("listItem").getBindingContextPath(),
            oUser = this.m_oUsersModel.getProperty(sPath);

        this.getOwnerComponent().openUserManagementDialog();
    };

    return Controller;
});