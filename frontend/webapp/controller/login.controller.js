sap.ui.define([
    "./ControllerBase",
    "sap/ui/model/json/JSONModel",
    "com/app/manager/Formatter",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState"
], function (Controller, JSONModel, Formatter, MessageToast, ValueState) {
    "use strict";

    var Controller = Controller.extend("com.app.controller.userManagement", {
        formatter: Formatter
    }),
        ControllerProto = Controller.prototype;
    
    ControllerProto.name = "login";
    ControllerProto.CLASS_SIGN_UP_ERROR_ANIMATION = "kellojoM-login-loginForm-flg-error";


    
    ControllerProto.onInit = function() {
        var oView = this.getView();

        this.m_oNavContainer = oView.byId("idNavContainer");
        this.m_oSignUpForm = oView.byId("idSignUpForm");
        this.m_oLoginModel = new JSONModel({
            email: "",
            password: "",
            password1: "",

            isSignInBusy: false,
            isSignUpBusy: false,

            signUpEmailValueState: ValueState.None,
            signUpPasswordValueState: ValueState.None,            
        });
        oView.setModel(this.m_oLoginModel);
    };


    // --------------------------
    // Event Handler
    // --------------------------

    ControllerProto.onSignInButtonPress = function() {
        var oUserManager = this.getOwnerComponent().getUserManager();
        this.m_oLoginModel.setProperty("/isSignInBusy", true);

        oUserManager.login(
            this.m_oLoginModel.getProperty("/email"),
            this.m_oLoginModel.getProperty("/password"),
            () => {
                this.getOwnerComponent().toUserManagement();
            },
            () => {},
            () => {
                this.m_oLoginModel.setProperty("/isSignInBusy", false);
            }
        );
    };

    ControllerProto.onSignUpButtonPress = function() {
        var oUserManager = this.getOwnerComponent().getUserManager(),
            bIsValid = this.onValidateRegistration();

        if (bIsValid) {
            this.m_oLoginModel.setProperty("/isSignUpBusy", true);
            oUserManager.signUp(
                this.m_oLoginModel.getProperty("/email"),
                this.m_oLoginModel.getProperty("/password"),
                () => {
                    this.getOwnerComponent().toUserManagement();
                },
                () => {},
                () => {
                    this.m_oLoginModel.setProperty("/isSignUpBusy", false);
                }
            );
        } else {
            this.m_oSignUpForm.removeStyleClass(this.CLASS_SIGN_UP_ERROR_ANIMATION);
            setTimeout(function() {
                this.m_oSignUpForm.addStyleClass(this.CLASS_SIGN_UP_ERROR_ANIMATION);
            }.bind(this), 0);
        }
    };

    ControllerProto.onToRegistrationsLinkPress = function() {
        this.m_oNavContainer.to(this.getView().byId("idRegistrationsPage"), "slide");
    };

    ControllerProto.onToLoginLinkPress = function() {
        this.m_oNavContainer.backToPage(this.getView().byId("idLoginPage"));
    };

    // --------------------------
    // Core Functionality
    // --------------------------


    /**
     * Validates the email & password input
     * @returns {boolean}
     * @protected
     */
    ControllerProto.onValidateRegistration = function() {
        var sPassword = this.m_oLoginModel.getProperty("/password"),
            sPassword1 = this.m_oLoginModel.getProperty("/password1") ,
            sEmail = this.m_oLoginModel.getProperty("/email"),
            bIsValidPassword = (sPassword === sPassword1 && sPassword.length >= 6),
            bIsValidEmail = sEmail.length >= 3 && sEmail.includes("@");

        this.m_oLoginModel.setProperty(
            "/signUpPasswordValueState",
            bIsValidPassword ? ValueState.None : ValueState.Error
        );
        
        this.m_oLoginModel.setProperty(
            "/signUpEmailValueState",
            bIsValidEmail ? ValueState.None : ValueState.Error
        );

        return bIsValidPassword && bIsValidEmail;
    };

    // --------------------------
    // Sorters & Formatters
    // --------------------------

    


    return Controller;
});