"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    csv: [
        {
            name: 'Age',
            min: 3,
            max: 120
        },
        {
            name: 'Name',
            minLength: 3,
            maxLength: 15,
            regExp: '^[a-zA-Z][a-zA-Z-]+[a-zA-Z]?$'
        },
        {
            name: 'Surname',
            minLength: 3,
            maxLength: 15,
            regExp: '^[a-zA-Z][a-zA-Z-]+[a-zA-Z]?$'
        },
        {
            name: 'Phone',
            length: 12,
            countryCode: 375,
            operatorCodes: '25, 29, 33, 44'
        },
        {
            name: 'Mail',
            minLength: 9,
            maxLength: 25,
            regExp: '[a-zA-Z0-9-_.]{2,}@[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,}'
        },
        {
            name: 'DateofReg',
            minLength: 10,
            maxLength: 10
        },
        {
            name: 'Time',
            minLength: 5,
            maxLength: 8
        }
    ]
};
//# sourceMappingURL=config.js.map