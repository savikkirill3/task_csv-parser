const main = require('./main');
const assert = require('chai').assert;
//const mysql = require('mysql');

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "savikkirill3",
//   database: "new_schema"
// });
// describe("Testing invalid_types[] and valid_types[]", () => {
//   it('Pars .csv and create invalid_types[] and valid_types[]', () => {
//     main.csvParser([
//       {
//         age: '20',
//         name: '12345Zaic',
//         surname: 'Dmitriev',
//         mail: 'Dima@mail.ru',
//         date: '02-05-2016',
//         phone: '+375293526547',
//         time: '18:50:00'
//       },
//       {
//         age: '15',
//         name: 'Inna',
//         surname: 'Bushilo',
//         mail: 'Inna@mail.ru',
//         date: '04-02-2017',
//         phone: '+375256578410',
//         time: '19:06:00'
//       }]);
//     var invalid = [
//       {
//         age: '20',
//         name: 'Error',
//         surname: 'Dmitriev',
//         mail: 'Dima@mail.ru',
//         date: '2016-02-05',
//         phone: '+375293526547',
//         time: '18:50:00'
//       }];
//     var valid = [
//       {
//         age: '15',
//         name: 'Inna',
//         surname: 'Bushilo',
//         mail: 'Inna@mail.ru',
//         date: '2017-04-02',
//         phone: '+375256578410',
//         time: '19:06:00'
//       }];
//
//     for (var key in invalid[0]){
//       assert.equal(invalid[0][key], main.invalid_type[0][key]);
//     }
//
//     for (var key in valid[0]){
//       assert.equal(valid[0][key], main.valid_type[0][key]);
//     }
//     con.end();
//   });
// });

describe("Testing name and surname", () => {
  it('return string if mask check [a-zA-Z] ', () => {
    assert.equal(main.isValidString('SAVIk'), 'SAVIk');
  });
  it('return Error if mask[a-zA-Z] not satisfy ', () => {
    assert.equal(main.isValidString('Савик'), 'Error');
    assert.equal(main.isValidString('S32avik'), 'Error');
  });
});

describe("Testing age", () => {
  it('return number if type age number and age<=120', () => {
    assert.equal(main.isValidNumber('20'), 20);
    assert.equal(main.isValidNumber('220'), 'Age error');
    assert.equal(main.isValidNumber('kirill'), 'Age error');
    assert.equal(main.isValidNumber(' '), 'Age error');
  });
});

describe("Testing mail", () => {
  it('return mail if mask check [a-zA-Z0-9-_.]{2,}@[a-zA-Z]{2,}[.][a-zA-Z]{2,}', () => {
    assert.equal(main.isValidMail('Vasya@mail.ru'), 'Vasya@mail.ru');
    assert.equal(main.isValidMail('Vasyamail.ru'), 'Email error');
    assert.equal(main.isValidMail('Vasya@mail.'), 'Email error');
    assert.equal(main.isValidMail('Vasya@m.ru'), 'Email error');
  });
});

describe("Testing phone", () => {
  it('return phone if phone valid', () => {
    assert.equal(main.isValidPhone('+375298035221'), '+375298035221');
    assert.equal(main.isValidPhone('375298035221'), 'Phone error');
    assert.equal(main.isValidPhone('+375(29) 803- 52  -21'), '+375298035221');
    assert.equal(main.isValidPhone('+375(55)8035221'), 'Phone error');
    assert.equal(main.isValidPhone('+3(44)8035221'), 'Phone error');
  });
});

describe("Testing data", () => {
  it('return date in format YYYY-MM-DD if date satisfies formats ["MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY"]', () => {
    assert.equal(main.isValidDate('02.05.2016'), '2016-02-05');
    assert.equal(main.isValidDate('02/05/2016'), '2016-02-05');
    assert.equal(main.isValidDate('02-05-2016'), '2016-02-05');
    assert.equal(main.isValidDate('02x05x2016'), '2016-02-05');
    assert.equal(main.isValidDate('32.05.2016'), 'Date error');
    assert.equal(main.isValidDate('22.02.2016'), 'Date error');
    assert.equal(main.isValidDate('22.02'), 'Date error');
    assert.equal(main.isValidDate('22.02.asfafs'), 'Date error');


  });
});

describe("Testing time", () => {
  it('return time in format HH:mm:ss if time satisfies formats ["hh:mm AM", "hh:mm PM"]', () => {
    assert.equal(main.isValidTIme('2:20 AM'), '02:20:00');
    assert.equal(main.isValidTIme('2:20 PM'), '14:20:00');
  });
  it('return time in format HH:mm:ss if time satisfies formats ["hh:mm"]', () => {
    assert.equal(main.isValidTIme('2:20'), '02:20:00');
    assert.equal(main.isValidTIme('23:20'), '23:20:00');
    assert.equal(main.isValidTIme('26:30'), 'Time error');
  });
});