sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/UIComponent',

    "sap/m/MessageStrip",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",

    "com/app/manager/Config",
    "com/app/manager/RestClient",
    "com/app/manager/Formatter",
    "com/app/manager/UserManager"
], function (jQuery, UIComponent, MessageStrip, Device, JSONModel, ResourceModel, Config, RestClient, Formatter) {
    "use strict";

    var Component = UIComponent.extend("com.app.Component", {
        metadata: {
            manifest: "json",

            events: {
                swipeUp: {},
                swipeDown: {},
                swipeLeft: {},
                swipeRight: {}
            }
        }
    });
    var ComponentProto = Component.prototype;

    ComponentProto.RestClient = RestClient;
    ComponentProto.ID_ERROR_MESSAGE_CONTAINER = "idErrorMessageContainer";

    ComponentProto.init = function () {
        UIComponent.prototype.init.apply(this, arguments);
        this.getRouter().initialize();

        //init firebase
        firebase.initializeApp({
            apiKey: "AIzaSyA0HD4i38wataaEQZqwG7EiTIj2thUuavk",
            authDomain: "ui5-roles.firebaseapp.com",
            databaseURL: "https://ui5-roles.firebaseio.com",
            projectId: "ui5-roles",
            storageBucket: "ui5-roles.appspot.com",
            messagingSenderId: "497695678668",
            appId: "1:497695678668:web:59c15bd65518674ee5a269"
        });

        //init beans
        Config.Beans.forEach(function(sBean) {
            var oBean = com.app.manager[sBean];
            if (!oBean) {
                jQuery.sap.log.error("Could not initialize missing bean '" + sBean + "'");
            } else {
                oBean = new oBean({});
                oBean.setOwnerComponent(this);
                oBean.onInit();
                this["get" + sBean] = function() {
                    return this;
                }.bind(oBean);
            }
        }.bind(this));

        //create shared dialogs
        this.m_oDialogs = {};
        for (var key in Config.SHARED_DIALOGS) {
            this.m_oDialogs[key] = {
                view: this.runAsOwner(function (sView) {
                    return sap.ui.xmlview(sView);
                }.bind(this, Config.SHARED_DIALOGS[key].view))
            };
        }

        //set device & i18n model
        this.setModel(new JSONModel(Device), "device");
        this.m_oI18nModel = new ResourceModel({
            bundleName: "com.app.i18n.i18n"
         })
        this.setModel(this.m_oI18nModel, "i18n");

        //init app header model
        this.setModel(new JSONModel({
            visible: true
        }), "appHeader");
        this.m_oAppHeaderModel = this.getModel("appHeader");

        //attach swipe gesture events
        if (Device.system.phone || Device.system.tablet) {
            this.xDown = null;
            this.yDown = null;
            document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
            document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);

            this.attachSwipeRight(this.navBack.bind(this));
        }
    };

    /**
     * Handler for the Authenticartion Change
     * @protected
     */
    ComponentProto.onAuthStateChange = function(oUser) {
        
    };

    // -------------------------------------
    // Touch Events
    // -------------------------------------

    ComponentProto.getTouches = function (evt) {
        return evt.touches ||          // browser API
            evt.originalEvent.touches; // jQuery
    };
    ComponentProto.handleTouchStart = function (evt) {
        const firstTouch = this.getTouches(evt)[0];
        this.xDown = firstTouch.clientX < 40 ? firstTouch.clientX: null;
        this.yDown = firstTouch.clientY;
    };
    ComponentProto.handleTouchMove = function (evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                this.fireSwipeLeft();
            } else {
                this.fireSwipeRight();
            }
        } else {
            if (yDiff > 0) {
                this.fireSwipeUp();
            } else {
                this.fireSwipeDown();
            }
        }

        this.xDown = null;
        this.yDown = null;
    };

    // -------------------------------------
    // Navigation
    // -------------------------------------

    ComponentProto.toXYZ = function (sTableId) {
        this.getRouter().navTo("xyz", {
            
        });
    };

    ComponentProto.openUserManagementDialog = function (oSettings) {
        oSettings = jQuery.extend(oSettings, {
            title: "userManagementDialog-title"
        });
        this.openDialog("userManagementDialog", oSettings);
    };

    /**
     * Navigates back, simple as that ;)
     */
    ComponentProto.navBack = function() {
            var oHistory = History.getInstance();
			    sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				console.error("Could not navigate back and not default fallback has been configured...");
			}
    };


    // -------------------------------------
    // Utility
    // -------------------------------------

    ComponentProto.showErrorMessage = function (sErrorMessage) {
        var oMessageStrip = new MessageStrip({
            text: sErrorMessage,
            type: "Error",
            showCloseButton: true
        });
        this.m_oErrorMessageContainer.addItem(oMessageStrip);
        setTimeout(function (oMessageStrip) { oMessageStrip.destroy() }.bind(this, oMessageStrip), 5000);
    };

    ComponentProto.openDialog = function (sDialog, oSettings) {
        var oView = this.m_oDialogs[sDialog].view,
            oController = oView.getController();
        oController

        var oDialog = new sap.m.Dialog({
            title: this.getResourceBundle().getText(oSettings.title)
        }).addStyleClass("glossary-dialog");
        oDialog.setModel(this.m_oI18nModel, "i18n");

        var oCloseButton = new sap.m.Button({
            text: "Close",
            type: "Transparent",
            press: function () {
                if (oController.onCloseInDialog) {
                    oController.onCloseInDialog();
                }
                oDialog.close();
            }
        });
        oDialog.setEndButton(oCloseButton);

        //Submit Button
        if (oSettings.submitButton) {
            var oSubmitButton = new sap.m.Button({
                text: oSettings.submitText || "Submit",
                type: "Emphasized",
                press: function () {

                    if (oSettings.fnOnSubmit) {
                        oSettings.fnOnSubmit(oDialog);
                    }
                    var bSubmitValid = true;

                    if (oController.onSubmitButtonPress) {
                        bSubmitValid = oController.onSubmitButtonPress();
                    }

                    if (bSubmitValid) {
                        if (oController.onCloseInDialog) {
                            oController.onCloseInDialog();
                        }
                        oDialog.close();
                    }
                }
            });
            oDialog.setBeginButton(oSubmitButton);
        }

        oDialog.addContent(this.m_oDialogs[sDialog].view);
        oDialog.open();

        if (oController.onOpenInDialog) {
            oController.onOpenInDialog(oSettings);
        }
    };

    /**
     * Registers an control to this component
     * @param {sap.ui.core.control} oControl - the control to register
     * @parag {string} sName - the name of the control
     */
    ComponentProto.registerControl = function (oControl, sName) {
        if (oControl && sName) {
            this["m_c" + sName] = oControl;

            if (sName === "BackButton") {
                oControl.attachPress(this.onBackButtonPressed.bind(this));
            }
        }
    };
    /**
     * Registeres an app header control
     */
    ComponentProto.registerAppHeaderControl = function(oControl, sName) {
        this.registerControl(oControl, sName);
        var oVisibilityData = this.m_oAppHeaderModel.getData(),
            sName = sName + "Visibility";
        oVisibilityData[sName] = false;
        this.m_oAppHeaderModel.setData(oVisibilityData);
        this.m_oAppHeaderModel.refresh(true);
        this["set" + sName] = function(sName, bVisible, fnPressHandler) {
            if (bVisible) {
                this.m_oAppHeaderModel.setProperty("/visible", true); //show app header, if value is true

                //attach/detach press handler if present
                if (typeof oControl.data("pressHandler") === "function") {
                    oControl.detachPress(oControl.data("pressHandler"));
                }
                if (
                    typeof oControl.attachPress === "function" &&
                    typeof fnPressHandler === "function"
                ) {
                    oControl.attachPress(fnPressHandler);
                    oControl.data("pressHandler", fnPressHandler);
                }
            }
            this.m_oAppHeaderModel.setProperty("/" + sName, bVisible);
        }.bind(this, sName);
    };
    /**
     * Gets a control by it's name
     * @param {string} sName - the name of the control. Has to be registered beforehand!
     */
    ComponentProto.getControl = function (sName) {
        return this["m_c" + sName];
    };

    /**
     * Get's the resource model
     * @returns {sap.ui.model.resource.ResourceBundle}
     * @public
     */
    ComponentProto.getResourceBundle = function() {
        return this.m_oI18nModel.getResourceBundle();
    };

    //
    // App Header
    //

    ComponentProto.onBackButtonPressed = function () {
        this.navBack();
    };

    /**
     * Sets the button visibility of any registered button, and the press handler
     */
    ComponentProto.setButtonVisible = function (sName, bVisible, fnOnPress) {
        this.m_oAppHeaderModel.setProperty("/" + sName + "Visible", bVisible);

        var oButton = this.getControl(sName),
            sHandlerVarName = "m_fnOn" + sName + "Press";
        if (this[sHandlerVarName]) {
            oButton.detachPress(this[sHandlerVarName]);
            this[sHandlerVarName] = null;
        }
        if (fnOnPress) {
            oButton.attachPress(fnOnPress);
            this[sHandlerVarName] = fnOnPress;
        }
    };

    /**
     * Hides all app hesder buttons
     * @public
     */
    ComponentProto.hideAllAppHeaderButtons = function() {
        var aKeys = Object.keys(this.m_oAppHeaderModel.getData());
        aKeys.forEach(function(sKey) {
            this.m_oAppHeaderModel.setProperty("/" + sKey, false);
        }.bind(this));
    };


    return Component;
})