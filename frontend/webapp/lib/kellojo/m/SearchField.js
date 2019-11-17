sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/SearchField"
], function (Control, SearchField) {
    return Control.extend("kellojo.m.SearchField", {
        metadata: {

            properties: {
                placeholder: { type: "string" }
            },

            events: {
                liveChange : {
                    parameters : {
                        newValue : {type : "string"}
                    }
                },
            }
        },

        init: function () {
            this.m_oSearchField = new SearchField();
            this.m_oSearchField.attachLiveChange(function(oEvent) {
                this.fireLiveChange({
                    newValue: oEvent.getParameter("newValue")
                })
            }.bind(this));
        },


        setPlaceholder: function(sPlaceholder, bSubpressInvalidate) {
            this.m_oSearchField.setPlaceholder(sPlaceholder, bSubpressInvalidate);
        },

        renderer: function (oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("kellojoM-SearchField");
            oRm.writeClasses(oControl);
            oRm.write(">");
            oRm.renderControl(oControl.m_oSearchField);
            oRm.write("</div>");
        }
    });
}
);
