sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Text",
    "sap/m/Label"
], function (Control, Text, Label) {
        return Control.extend("kellojo.m.Page", {
            metadata: {
                properties: {
                    title: {
                        type: "string",
                        defaultValue: "Title"
                    },
                    subTitle: {
                        type: "string",
                        defaultValue: "Subtitle"
                    }
                },

                aggregations: {
                    content: {
                        type: "sap.ui.core.Control",
                        multiple: true
                    }
                }
            },

            init: function() {
                this.m_oTitle = new Text({
                    text: this.getTitle()
                }).addStyleClass("kellojoM-page-header-title-text");

                this.m_oSubTitle = new Label({
                    text: this.getSubTitle()
                }).addStyleClass("kellojoM-page-header-subtitletitle-text");
            },

            setTitle: function(sTitle, bSuppressInvalidate) {
                this.m_oTitle.setText(sTitle);
            },
            setSubTitle: function(sSubTitle, bSuppressInvalidate) {
                this.m_oSubTitle.setText(sSubTitle);
            },

            renderer: function (oRm, oControl) {
                
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("kellojoM-page");
                oRm.writeClasses(oControl);
                oRm.write(">");

                

                    oRm.write("<div class='kellojoM-page-header'>");
                        oRm.write("<div class='kellojoM-page-header-title'>");
                            oRm.renderControl(oControl.m_oTitle);
                            oRm.renderControl(oControl.m_oSubTitle);
                        oRm.write("</div>");

                        oRm.write("<div class='kellojoM-page-header-mainAction'>");
                        
                        oRm.write("</div>");

                        oRm.write("<div class='kellojoM-page-header-Actions'>");
                        
                        oRm.write("</div>");
                    oRm.write("</div>");

                    oRm.write("<div class='kellojoM-page-content'>");
                    var aContent = oControl.getContent();
                    aContent.forEach(oItem => {
                        oRm.renderControl(oItem);
                    });
                    oRm.write("</div>");



                oRm.write("</div>");
            }
        });
    }
);
