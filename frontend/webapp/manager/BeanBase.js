sap.ui.define([
    "sap/ui/base/ManagedObject",
], function (ManagedObject) {
    "use strict";

    var BeanBase = ManagedObject.extend("com.app.manager.BeanBase", {}),
        BeanBaseProto = BeanBase.prototype;


    BeanBaseProto.onInit = function() {};
    BeanBaseProto.setOwnerComponent = function(oComponent) {
        this.m_oOwnerComponent = oComponent
    }
    BeanBaseProto.getOwnerComponent = function() {
        return this.m_oOwnerComponent;
    }

    return BeanBase;
});