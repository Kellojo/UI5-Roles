sap.ui.define([
    "com/app/manager/BeanBase",
], function (BeanBase) {
    "use strict";

    var Formatter = BeanBase.extend("com.app.manager.Formatter", {});

    Formatter.formatFirebaseTimestamp = function (otimestamp) {
        if (!otimestamp) {
            return "";
        }

        var oDate = null;
        if (otimestamp instanceof Date) {
            oDate = otimestamp;
        } else {
            oDate = new Date(otimestamp.seconds * 1000);
        }
        var iMonth = oDate.getMonth() + 1,
            sMonth = iMonth < 10 ? "0" + iMonth : iMonth;
        return oDate.getDate() + "." + sMonth + "." + oDate.getFullYear()
    };

    Formatter.formatFirebaseTimestampLong = function (otimestamp) {
        if (!otimestamp) {
            return "";
        }

        var oDate = null;
        if (otimestamp instanceof Date) {
            oDate = otimestamp;
        } else {
            oDate = new Date(otimestamp.seconds * 1000);
        }
        return oDate.toLocaleString();
    };


    return Formatter;
});