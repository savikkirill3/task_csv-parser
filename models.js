"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function length(minLength, maxLength) {
    return function (str) {
        return str.length >= minLength && str.length <= maxLength;
    };
}
exports.length = length;
function num(min, max) {
    return function (str) {
        return +str >= +min && +str <= +max;
    };
}
exports.num = num;
function validPhone(length, countryCode, operatorCodes) {
    return function (str) {
        let parts = str.match(/\d{1,}/g);
        if (/^\+/.test(str) && !/[a-zA-Z]/.test(str)) {
            let number = parts.join('');
            return number.length === length && +number.slice(0, 3) === countryCode
                && new RegExp(number.slice(3, 5)).test(operatorCodes);
        }
        return false;
    };
}
exports.validPhone = validPhone;
function validDate(date) {
    if (moment(date, ["MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY"]).isValid()) {
        return true;
    }
    return false;
}
exports.validDate = validDate;
function newDate(date) {
    return moment(date, ["MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY"]).format("YYYY-MM-DD");
}
exports.newDate = newDate;
function validTime(time) {
    if (moment(time, ["hh:mm a", "hh:mm"]).isValid()) {
        return true;
    }
    return false;
}
exports.validTime = validTime;
function newTime(time) {
    return moment(time, ["hh:mm A", "hh:mm"]).format("HH:mm:ss");
}
exports.newTime = newTime;
//# sourceMappingURL=models.js.map