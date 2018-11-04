"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var csv = require("csvtojson");
var jsonToCsv = require("json-to-csv");
var mysql = require("mysql");
var moment = require("moment");
var phone = require("phone");
var invalid_types = [];
exports.invalid_type = invalid_types;
var valid_types = [];
exports.valid_type = valid_types;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "savikkirill3",
    database: "new_schema"
});
exports.con = con;
csv()
    .fromFile('user.csv')
    .then(function (jsonObj) {
    csvParser(jsonObj);
});
function sendToCsv(invalid_types) {
    jsonToCsv(invalid_types, 'something.csv')
        .then(function () {
    })
        .catch(function (error) {
    });
}
function sendToMysql(valid_types) {
    // con.query('CREATE TABLE IF NOT EXISTS SET ? (' +
    //     'cat_id INT  AUTO_INCREMENT PRIMARY KEY,' +
    //     'name VARCHAR(45),' +
    //     'surname VARCHAR(45),' +
    //     'age INT,' +
    //     'mail VARCHAR(45),' +
    //     'phone VARCHAR(45),' +
    //     'date DATE,' +
    //     'time TIME);');
    valid_types.forEach(function (el) {
        con.query('INSERT INTO data SET ?', el, function (err, result) {
            if (err)
                throw err;
            console.log("Record inserted");
        });
    });
    con.end();
}
function csvParser(results) {
    results.forEach(function (el) {
        el.name = String(el.name);
        el.surname = String(el.surname);
        el.age = StringToNumber(el.age);
        el.mail = ValidMail(el.mail);
        el.phone = Phone(el.phone);
        el.date = StringToDate(el.date);
        el.time = StringToTime(el.time);
        if (el.name == "Error" || el.age == "Age error" || el.surname == "Error" || el.date == "Date error" || el.time == "Time error" || el.mail == "Email error" || el.phone == "Phone error") {
            invalid_types.push(el);
        }
        else {
            valid_types.push(el);
        }
    });
    sendToCsv(invalid_types);
    sendToMysql(valid_types);
}
exports.csvParser = csvParser;
function String(str) {
    if (str.match(/[a-zA-Z]/) && !str.match(/[0-9]/)) {
        return str;
    }
    else {
        return 'Error';
    }
}
exports.isValidString = String;
function StringToNumber(number) {
    if (Number(number) && number <= 120) {
        return number;
    }
    else {
        return "Age error";
    }
}
exports.isValidNumber = StringToNumber;
function ValidMail(mail) {
    if (mail.match(/[a-zA-Z0-9-_.]{2,}@[a-zA-Z]{2,}[.][a-zA-Z]{2,}/)) {
        return mail;
    }
    else {
        return "Email error";
    }
}
exports.isValidMail = ValidMail;
function Phone(phone_number) {
    if (phone(phone_number)[0]) {
        return phone(phone_number)[0];
    }
    else {
        return "Phone error";
    }
}
exports.isValidPhone = Phone;
function StringToDate(date) {
    if (moment(date, ["MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY"]).isValid()) {
        return moment(date, ["MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY"]).format("YYYY-MM-DD");
    }
    else {
        return "Date error";
    }
}
exports.isValidDate = StringToDate;
function StringToTime(time) {
    if (time.indexOf('AM') + 1 || time.indexOf('PM') + 1) {
        if (moment(time, ["hh:mm a"]).isValid()) {
            time = moment(time, ["hh:mm A"]).format("HH:mm:ss");
            return time;
        }
        else {
            return "Time error";
        }
    }
    else {
        if (moment(time, ["hh:mm"]).isValid()) {
            time = moment(time, ["hh:mm"]).format("HH:mm:ss");
            return time;
        }
        else {
            return "Time error";
        }
    }
}
exports.isValidTIme = StringToTime;
