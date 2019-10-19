sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Text"
], function (Control, Text) {
        return Control.extend("kellojo.m.SectionHeader", {
            metadata: {

                properties: {
                    text: {
                        type: "string"
                    }
                }
            },

            renderer: function (oRm, oControl) {
                
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("kellojoM-sectionHeader");
                oRm.writeClasses(oControl);
                oRm.write(">");

                oRm.renderControl(new Text({
                    text: oControl.getText()
                }));

                oRm.write("</div>");
            }
        });
    }
);
