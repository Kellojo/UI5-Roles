sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Label",
    "sap/m/CheckBox",
    "sap/m/Text"
], function (Control, Label, CheckBox, Text) {
        return Control.extend("kellojo.m.RolesDisplay", {
            metadata: {
                properties: {
                    roles: {
                        type: "object"
                    },
                    editable: {
                        type: "boolean",
                        defaultValue: false
                    },

                    userRolesText: {
                        type: "string"
                    }
                },
            },

            init: function() {
                this.m_oUserRolesText = new Label();
            },

            setRoles: function(oRoles) {
                this.m_aCheckBoxes = {};
                var aRoles = [];
                if (oRoles) {
                    aRoles = Object.keys(oRoles);
                }

                aRoles.forEach(sRole => {
                    this.m_aCheckBoxes[sRole] = new CheckBox({
                        text: sRole,
                        selected: oRoles[sRole].hasRole
                    }).attachSelect((oEvent) => {
                        oEvent.getSource().rerender();

                        //update properties on the custom control
                        var oRoles = this.getRoles();
                        oRoles[sRole].hasRole = oEvent.getSource().getSelected();
                        this.setProperty("roles", oRoles);
                    });
                });

                this.setProperty("roles", oRoles);
                this.rerender();
            },

            renderer: function (oRm, oControl) {
                var bIsEditable = oControl.getEditable(),
                    oRoles = oControl.getRoles();
                
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("kellojoM-rolesDisplay");
                oRm.writeClasses(oControl);
                oRm.write(">");

                if (bIsEditable) {
                    oRm.renderControl(new Text({ text: oControl.getUserRolesText()}));
                }


                if (oRoles) {
                    var aRoles = Object.keys(oRoles);
                    if (aRoles.length > 0) {
                        aRoles.forEach(sRole => {
                            var oRole = oRoles[sRole];

                            if (bIsEditable) {
                                oRm.renderControl(oControl.m_aCheckBoxes[sRole]);
                            } else if (oRole.hasRole) {
                                oRm.renderControl(new Label({
                                    text: sRole
                                }));
                            }
                        });
                    }
                }

                oRm.write("</div>");
            }
        });
    }
);
