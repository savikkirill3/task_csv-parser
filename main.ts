import * as csv from 'csvtojson';
import * as jsonToCsv from 'json-to-csv';
import * as mysql from 'mysql';
import {config} from './config';
import {Csv} from './interface';
import {length, num, validPhone, validDate, newDate,validTime, newTime} from './models';

const invalidTypes: Csv[] = [];
const validTypes: Csv[] = [];
const error: any = {};

csv()
    .fromFile('users.csv')
    .then((jsonObj) => {
      validation(jsonObj);
    });

function validation(jsonObj: Array<Csv>): void {

  jsonObj.forEach((el: Csv) => {

    let validObj: any;

    validObj = config.csv.find(item => item.name === 'Age');
    error.Age = num(validObj.min, validObj.max)(+el.Age);

    validObj = config.csv.find(item => item.name === 'Name');
    error.Name = length(validObj.minLength, validObj.maxLength)(el.Name)
        && new RegExp(validObj.regExp).test(el.Name);

    validObj = config.csv.find(item => item.name === 'Surname');
    error.Surname = length(validObj.minLength, validObj.maxLength)(el.Surname)
        && new RegExp(validObj.regExp).test(el.Surname);

    validObj = config.csv.find(item => item.name === 'Mail');
    error.Mail = length(validObj.minLength, validObj.maxLength)(el.Mail)
        && new RegExp(validObj.regExp).test(el.Mail);

    validObj = config.csv.find(item => item.name === 'Phone');
    error.Phone = validPhone(validObj.length, validObj.countryCode,
        validObj.operatorCodes)(el.Phone);

    validObj = config.csv.find(item => item.name === 'DateofReg');
    error.DateofReg = length(validObj.minLength, validObj.maxLength)(el.DateofReg)
        && validDate(el.DateofReg);

    validObj = config.csv.find(item => item.name === 'Time');
    error.Time = length(validObj.minLength, validObj.maxLength)(el.Time)
        && validTime(el.Time);


    if (error.Age && error.Name && error.Surname && error.Mail
        && error.Phone && error.DateofReg && error.Time) {
      el.DateofReg = newDate(el.DateofReg);
      el.Time = newTime(el.Time);
      validTypes.push(el);
    } else {
      invalidTypes.push(el);
    }
  });
  sendToMysql(validTypes);
  sendToCsv(invalidTypes);
}

function sendToCsv(invalidTypes: Csv[]):void {
  jsonToCsv(invalidTypes, 'invalidUsers.csv')
      .then(function () {console.log('Created invalidUsers.csv')
      })
      .catch(function (error:string) {console.log(error)
      });
}



function sendToMysql(validTypes:Csv[]):void {
  // con.query('CREATE TABLE IF NOT EXISTS SET ? (' +
  //     'cat_id INT  AUTO_INCREMENT PRIMARY KEY,' +
  //     'name VARCHAR(45),' +
  //     'surname VARCHAR(45),' +
  //     'age INT,' +
  //     'mail VARCHAR(45),' +
  //     'phone VARCHAR(45),' +
  //     'date DATE,' +
  //     'time TIME);');
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "savikkirill3",
    database: "new_schema"
  });
  con.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('Сonnected!');
  });
  validTypes.forEach(function (el) {
    con.query('INSERT INTO data SET ?', el, function (err) {
      if (err) throw err;
      console.log(`Record inserted`);
    });
  });
  con.end();
}