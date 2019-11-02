sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/app/manager/Formatter",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/GroupHeaderListItem",
], function (Controller, JSONModel, Formatter, MessageToast, Filter, FilterOperator, GroupHeaderListItem) {
    "use strict";

    var Controller = Controller.extend("com.app.controller.userManagement", {
        formatter: Formatter
    }),
        ControllerProto = Controller.prototype;

    
    ControllerProto.onInit = function() {
        this.m_oUserTable = this.getView().byId("idUserTable");
        this.m_oUsersModel = new JSONModel({
            users: [],
            userCount: 0,
            isLoadingUsers: false,
            allRoles: []
        });
        this.m_oUsersModel.setSizeLimit(9999999);
        this.getView().setModel(this.m_oUsersModel);

        this.loadUsers();
    };


    // --------------------------
    // Core Functionality
    // --------------------------

    /**
     * Loads all users
     * @param {boolean} bIsScrollToLoadTriggered
     * @public
     */
    ControllerProto.loadUsers = function(oEvent, bIsScrollToLoadTriggered) {
        if (this.m_oUsersModel.getProperty("/isLoadingUsers") || (bIsScrollToLoadTriggered && !this.m_sNextPageToken)) {
            return;
        }
        bIsScrollToLoadTriggered = bIsScrollToLoadTriggered && this.m_sNextPageToken;

        this.m_oUsersModel.setProperty("/isLoadingUsers", true);
        var oRequest = {
            success: (oData) => {
                if (bIsScrollToLoadTriggered) {
                    var aUsers = this.m_oUsersModel.getProperty("/users");
                    aUsers.push.apply(aUsers, oData.results);
                    this.m_oUsersModel.setProperty("/users", aUsers);
                    this.m_oUsersModel.setProperty("/userCount", aUsers.length);
                } else {
                    this.m_oUsersModel.setProperty("/users", oData.results);
                    this.m_oUsersModel.setProperty("/userCount", oData.results.length);
                }

                this.m_sNextPageToken = oData.nextPageToken;
                this.m_oUsersModel.setProperty("/allRoles", oData.allRoles);
            },
            complete: () => {
                this.m_oUsersModel.setProperty("/isLoadingUsers", false);
            },
        }

        if (bIsScrollToLoadTriggered) {
            oRequest.nextPageToken = this.m_sNextPageToken;
        }
        this.getOwnerComponent().getUserManager().readAllUsers(oRequest);
    };

    // --------------------------
    // Event Handlers
    // --------------------------


    /**
     * Triggered when the search input changes
     * @parsam {object} oEvent
     * @public
     */
    ControllerProto.onSearch = function(oEvent) {
        var oBinding = this.m_oUserTable.getBinding("items"),
            sSearchValue = oEvent.getParameter("newValue").trim(),
            aFilters = [];

        if (sSearchValue.length > 0) {
            aFilters.push(new Filter("email", FilterOperator.Contains, sSearchValue));
        }
        oBinding.filter(aFilters);
    };


    /**
     * Triggered, when a user list item is pressed by the user
     * @param {object} oEvent
     * @public
     */
    ControllerProto.onUserItemPress = function(oEvent) {
        var sPath = oEvent.getParameter("listItem").getBindingContextPath(),
            oUser = this.m_oUsersModel.getProperty(sPath);

        this.getOwnerComponent().openUserManagementDialog({
            user: oUser,
            submitButton: true,
            onUpdateRolesSuccess: this.onUpdateRolesSuccess.bind(this),
            allRoles: this.m_oUsersModel.getProperty("/allRoles")
        });
    };

    /**
     * Triggered, when the roles of a user are updated
     * @param {object} oUser - the updated user object
     * @public
     */
    ControllerProto.onUpdateRolesSuccess = function(oUser) {
        var aUsers = this.m_oUsersModel.getProperty("/users"),
            sText = this.getOwnerComponent().getResourceBundle().getText("userManagementDialog-updateSuccessTitle", [oUser.email]);
        for(var i = 0; i < aUsers.length; i++) {
            if (oUser.uid === aUsers[i].uid) {
                this.m_oUsersModel.setProperty("/users/" + i + "/", oUser);
                this.m_oUsersModel.refresh(true);
                break;
            }
        }

        MessageToast.show(sText);
    };

    /**
     * Handles the scroll to load event
     * @public 
     */
    ControllerProto.onScrollToLoadTriggered = function() {
        this.loadUsers(null, true);
    };

    // --------------------------
    // Sorters & Formatters
    // --------------------------

    ControllerProto.sortUsers = function(oUser1, oUser2) {
        return this.getOwnerComponent().getUserManager().sortUsers(oUser1, oUser2);
    };

    ControllerProto.groupUsers = function(oContext) {
        var oUser = oContext.getObject();
        return this.getOwnerComponent().getUserManager().hasAnyRoles(oUser);
    };

    ControllerProto.getGroupHeader = function(oGroup) {
        var oResourceBundle = this.getOwnerComponent().getResourceBundle();
        return new GroupHeaderListItem({
            title: oGroup.key ? 
                oResourceBundle.getText("userManagement-GroupHeader-WithRoles") :
                oResourceBundle.getText("userManagement-GroupHeader-NoRoles"),
            upperCase: false
        });
    };


    return Controller;
});