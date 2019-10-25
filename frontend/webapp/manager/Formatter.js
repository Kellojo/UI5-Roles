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


    /**
     * Formats date in the long format (i.e. 14:59, 10.08.2019)
     * @param {Date || string || number} oDate
     * @returns {stering}
     * @public
     */
    Formatter.formatDateLong = function(oDate) {
        return this.formatTime(oDate) + ", " + this.formatDate(oDate);
    };

    /**
     * Formats date in the long format (i.e. 10.08.2019)
     * @param {Date || string || number} oDate
     * @returns {stering}
     * @public
     */
    Formatter.formatDate = function(oDate) {
        if (typeof oDate === "string" || typeof oDate === "number") {
            oDate = new Date(oDate);
        }

        if (!oDate) {
            return "";
        }

        var sDate = "",
            iYear = oDate.getFullYear(),
            iMonth = oDate.getMonth(),
            iDay = oDate.getDate(),
            fnEnsureZero = function(iNumber) {
                if (iNumber < 10) {
                    iNumber = "0" + iNumber;
                }
                return iNumber;
            }

        iMonth = fnEnsureZero(iMonth);
        iDay = fnEnsureZero(iDay);

        return iDay + "." + iMonth + "." + iYear;
    };

    /**
     * Formats the time of the date (i.e. 10:39)
     * @param {Date || string || number} oDate
     * @returns {stering}
     * @public
     */
    Formatter.formatTime = function(oDate) {
        if (typeof oDate === "string" || typeof oDate === "number") {
            oDate = new Date(oDate);
        }

        if (!oDate) {
            return "";
        }

        var iHour = oDate.getHours(),
            iMinutes = oDate.getMinutes(),
            fnEnsureZero = function(iNumber) {
                if (iNumber < 10) {
                    iNumber = "0" + iNumber;
                }
                return iNumber;
            }

        iHour = fnEnsureZero(iHour);
        iMinutes = fnEnsureZero(iMinutes);

        return iHour + ":" + iMinutes;
    }

    /**
     * Formats date in the long format (i.e. 10 seconds ago)
     * @param {Date || string || number} oDate
     * @returns {stering}
     * @public
     */
    Formatter.fromNow = function(oDate) {
        if (!oDate) {
            return;
        }

        if (oDate._seconds) {
            oDate = oDate._seconds * 1000;
        }

        return moment(oDate).fromNow();
    };

    return Formatter;
});