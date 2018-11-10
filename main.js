"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv = require("csvtojson");
const jsonToCsv = require("json-to-csv");
const mysql = require("mysql");
const config_1 = require("./config");
const models_1 = require("./models");
const invalidTypes = [];
const validTypes = [];
const error = {};
csv()
    .fromFile('users.csv')
    .then((jsonObj) => {
    validation(jsonObj);
});
function validation(jsonObj) {
    jsonObj.forEach((el) => {
        let validObj;
        validObj = config_1.config.csv.find(item => item.name === 'Age');
        error.Age = models_1.num(validObj.min, validObj.max)(el.Age);
        validObj = config_1.config.csv.find(item => item.name === 'Name');
        error.Name = models_1.length(validObj.minLength, validObj.maxLength)(el.Name)
            && new RegExp(validObj.regExp).test(el.Name);
        validObj = config_1.config.csv.find(item => item.name === 'Surname');
        error.Surname = models_1.length(validObj.minLength, validObj.maxLength)(el.Surname)
            && new RegExp(validObj.regExp).test(el.Surname);
        validObj = config_1.config.csv.find(item => item.name === 'Mail');
        error.Mail = models_1.length(validObj.minLength, validObj.maxLength)(el.Mail)
            && new RegExp(validObj.regExp).test(el.Mail);
        validObj = config_1.config.csv.find(item => item.name === 'Phone');
        error.Phone = models_1.validPhone(validObj.length, validObj.countryCode, validObj.operatorCodes)(el.Phone);
        validObj = config_1.config.csv.find(item => item.name === 'DateofReg');
        error.DateofReg = models_1.length(validObj.minLength, validObj.maxLength)(el.DateofReg)
            && models_1.validDate(el.DateofReg);
        validObj = config_1.config.csv.find(item => item.name === 'Time');
        error.Time = models_1.length(validObj.minLength, validObj.maxLength)(el.Time)
            && models_1.validTime(el.Time);
        if (error.Age && error.Name && error.Surname && error.Mail
            && error.Phone && error.DateofReg && error.Time) {
            el.DateofReg = models_1.newDate(el.DateofReg);
            el.Time = models_1.newTime(el.Time);
            validTypes.push(el);
        }
        else {
            invalidTypes.push(el);
        }
    });
    sendToMysql(validTypes);
    sendToCsv(invalidTypes);
}
function sendToCsv(invalidTypes) {
    jsonToCsv(invalidTypes, 'invalidUsers.csv')
        .then(function () {
        console.log('Created invalidUsers.csv');
    })
        .catch(function (error) {
    });
}
function sendToMysql(validTypes) {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "savikkirill3",
        database: "new_schema"
    });
    con.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('Сonnected!');
    });
    validTypes.forEach(function (el) {
        con.query('INSERT INTO data SET ?', el, function (err) {
            if (err)
                throw err;
            console.log(`Record inserted`);
        });
    });
    con.end();
}
//# sourceMappingURL=main.js.map