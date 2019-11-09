sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Label",
    "sap/m/Text",
    "./Wrapper"
], function (Control, Label, Text, Wrapper) {
        return Control.extend("kellojo.m.TableBusyIndicator", {
            metadata: {
                properties: {
                    label: {
                        type: "string"
                    },
                    text: {
                        type: "string"
                    }
                }
            },

            init: function() {
                this.m_oBusyIndicator = new Wrapper()
                    .setBusy(true)
                    .setBusyIndicatorDelay(0)
                    .addStyleClass("kellojoM-tableBusyIndicator-busyIndicator");
                this.m_oLabel = new Label();
                this.m_oText = new Text();
            },

            setLabel: function(sText) {
                this.m_oLabel.setText(sText);
            },

            setText: function(sText) {
                this.m_oText.setText(sText);
            },

            renderer: function (oRm, oControl) {
                
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("kellojoM-tableBusyIndicator");
                oRm.writeClasses(oControl);
                oRm.write(">");

                oRm.renderControl(oControl.m_oBusyIndicator);

                oRm.write("<div class='kellojoM-tableBusyIndicator-textContainer'>");
                oRm.renderControl(oControl.m_oText);
                oRm.renderControl(oControl.m_oLabel);
                oRm.write("</div>");

                oRm.write("</div>");
            }
        });
    }
);
