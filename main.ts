import * as csv from 'csvtojson';
import * as jsonToCsv from 'json-to-csv';
import * as mysql from 'mysql';
import {config} from './config';
import {Csv} from './interface';
import {checkLength, checkNum, validPhone, validDate, newDate,validTime, newTime} from './models';

const invalidTypes: Csv[] = [];
const validTypes: Csv[] = [];
const error: any = {};

csv()
    .fromFile('users.csv')
    .then((jsonObj) => {
      validation(jsonObj);
    });

function validation(jsonObj: Array<Csv>): void {

  jsonObj.forEach((element: Csv) => {

    let validObj: any;

    validObj = checkName('Age');
    error.Age = checkNum(validObj.min, validObj.max)(+element.Age);

    validObj = checkName('Name');
    error.Name = checkLength(validObj.minLength, validObj.maxLength)(element.Name)
        && new RegExp(validObj.regExp).test(element.Name);

    validObj = checkName('Surname');
    error.Surname = checkLength(validObj.minLength, validObj.maxLength)(element.Surname)
        && new RegExp(validObj.regExp).test(element.Surname);

    validObj = checkName('Mail');
    error.Mail = checkLength(validObj.minLength, validObj.maxLength)(element.Mail)
        && new RegExp(validObj.regExp).test(element.Mail);

    validObj = checkName('Phone');
    error.Phone = validPhone(validObj.length, validObj.countryCode,
        validObj.operatorCodes)(element.Phone);

    validObj = checkName('DateofReg');
    error.DateofReg = checkLength(validObj.minLength, validObj.maxLength)(element.DateofReg)
        && validDate(element.DateofReg);

    validObj = checkName('Time');
    error.Time = checkLength(validObj.minLength, validObj.maxLength)(element.Time)
        && validTime(element.Time);


    if (error.Age && error.Name && error.Surname && error.Mail
        && error.Phone && error.DateofReg && error.Time) {
      element.DateofReg = newDate(element.DateofReg);
      element.Time = newTime(element.Time);
      validTypes.push(element);
    } else {
      invalidTypes.push(element);
    }
  });
  sendToMysql(validTypes);
  sendToCsv(invalidTypes);
}

function checkName(name: string) {
  return config.csv.find(item => item.name === name);
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
  const command = 'INSERT INTO data SET ?';

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "savikkirill3",
    database: "new_schema"
  });
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('Сonnected!');
  });
  validTypes.forEach(function (el) {
    connection.query(command, el, function (err) {
      if (err) throw err;
      console.log(`Record inserted`);
    });
  });
  connection.end();
}