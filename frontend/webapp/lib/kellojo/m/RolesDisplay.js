sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Label"
], function (Control, Label) {
        return Control.extend("kellojo.m.RolesDisplay", {
            metadata: {
                properties: {
                    roles: {
                        type: "array"
                    }
                },
            },

            init: function() {
                
            },

            renderer: function (oRm, oControl) {
                
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("kellojoM-rolesDisplay");
                oRm.writeClasses(oControl);
                oRm.write(">");

                var aRoles = oControl.getRoles();
                if (typeof aRoles === "array" && aRoles.length > 0) {
                    aRoles.forEach(oRole => {
                        oRm.renderControl(new Label({
                            text: oRole.displayName
                        }));
                    });
                } else {
                    oRm.renderControl(new Label({
                        text: "None"
                    }));
                }

                oRm.write("</div>");
            }
        });
    }
);
