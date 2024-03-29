const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    //in order to validate anything , it has to be in string format
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Job title field is required';
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'company field is required';
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = 'from date field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
