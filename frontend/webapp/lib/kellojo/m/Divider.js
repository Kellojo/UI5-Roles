sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
        return Control.extend("kellojo.m.Divider", {
            metadata: {},

            renderer: function (oRm, oControl) {

                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("kellojoM-divider");
                oRm.writeClasses(oControl);
                oRm.write(" />");
            }
        });
    }
);
