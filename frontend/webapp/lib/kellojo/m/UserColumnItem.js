sap.ui.define([
    "sap/m/ColumnListItem",
    "sap/m/Link",
    "sap/m/Label"
], function (Control, Link, Label) {
        return Control.extend("kellojo.m.UserColumnItem", {
            metadata: {
                properties: {
                    firstName: {
                        type: "string",
                        defaultValue: ""
                    },
                    lastName: {
                        type: "string",
                        defaultValue: ""
                    },
                    email: {
                        type: "string",
                        defaultValue: ""
                    }
                },
            },

            init: function() {
                this.m_oUserNameLabel = new Label({
                    text: this.getFirstName()
                }).addStyleClass("kellojoM-");
            },

            renderer: function (oRm, oControl) {
                
                oRm.write("<tr");
                oRm.writeControlData(oControl);
                oRm.addClass("kellojoM-UserColumnItem");
                oRm.writeClasses(oControl);
                oRm.write(">");

                oRm.write("<td>");
                oRm.renderControl(oControl.m_oUserNameLabel);
                oRm.write("</td>");

                oRm.write("<td>");
                oRm.renderControl(oControl.m_oUserNameLabel);
                oRm.write("</td>");

                oRm.write("<td>");
                oRm.renderControl(oControl.m_oUserNameLabel);
                oRm.write("</td>");


                oRm.write("</tr>");
            }
        });
    }
);
