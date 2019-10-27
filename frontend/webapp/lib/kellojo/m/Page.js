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
                    },

                    mainAction: {
                        type: "sap.ui.core.Control",
                        multiple: true
                    }
                },

                defaultAggregation: "content"
            },

            init: function() {
                this.m_oTitle = new Text({
                    text: this.getTitle()
                }).addStyleClass("kellojoM-page-header-title-text");

                this.m_oSubTitle = new Label({
                    text: this.getSubTitle()
                }).addStyleClass("kellojoM-page-header-subtitletitle-text");
            },

            onAfterRendering: function() {
                this.getHeaderHeight();
            },

            // ---------------------------
            // Getters & Setters
            // ---------------------------

            setTitle: function(sTitle, bSuppressInvalidate) {
                this.m_oTitle.setText(sTitle);
            },
            setSubTitle: function(sSubTitle, bSuppressInvalidate) {
                this.m_oSubTitle.setText(sSubTitle);
            },

            /**
             * Gets the outer height of the page header & also updates the css variable for it
             * @returns {number}
             * @public 
             */
            getHeaderHeight: function() {
                var oDomRef = this.getDomRef();
                if (oDomRef) {
                    var oPageHeader = jQuery(oDomRef).find(".kellojoM-page-header");
                    if (oPageHeader) {
                        var iHeaderHeight = oPageHeader.innerHeight();
                        oDomRef.style.setProperty('--kellojoM-page-header-height', iHeaderHeight + "px");
                        return iHeaderHeight;
                    }
                }

                return 0;
            },


            // ---------------------------
            // Renderer
            // ---------------------------

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
                        var aContent = oControl.getMainAction();
                        aContent.forEach(oItem => {
                            oRm.renderControl(oItem);
                        });
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
