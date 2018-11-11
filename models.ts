import * as moment from 'moment';

export function length(minLength: number, maxLength: number): Function {
  return function (str: { length: number }): boolean {
    return str.length >= minLength && str.length <= maxLength;
  }
}

export function num(min: string, max: string): Function {
  return function (age: number): boolean {
    return age >= +min && age <= +max;
  }
}

export function validPhone(length: number, countryCode: number, operatorCodes: string): Function {
  return function (str: string): boolean {
    let parts: Array<string> = str.match(/\d{1,}/g);
    if (/^\+/.test(str) && !/[a-zA-Z]/.test(str)) {
      let number: string = parts.join('');
      return number.length === length && +number.slice(0, 3) === countryCode
          && new RegExp(number.slice(3, 5)).test(operatorCodes)
    }
    return false;
  }
}

export function validDate(date: string): boolean {
  if (moment(date, ["MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY"]).isValid()) {
    return true;
  }
  return false;
}

export function newDate(date: string): string {
  return moment(date, ["MM/DD/YYYY", "MM-DD-YYYY", "MM.DD.YYYY"]).format("YYYY-MM-DD")
}

export function validTime(time:string):boolean {
  if (moment(time, ["hh:mm a", "hh:mm"]).isValid()) {
    return true;
  }
  return false;
}

export function newTime(time: string): string {
  return moment(time, ["hh:mm A", "hh:mm"]).format("HH:mm:ss");
}