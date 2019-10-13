sap.ui.define([
    
], function () {
    "use strict";

    var Config = {
        Beans: [
            //"Formatter",
            "RestClient",
            "UserManager"
        ],

        BACKEND_BASE_URL: "https://us-central1-ui5-roles.cloudfunctions.net/api/",

        SHARED_DIALOGS: {
            userManagementDialog: {
                view: "com.app.view.dialog.userManagementDialog"
            }
        }
    }


    return Config;
});