const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    //in order to validate anything , it has to be in string format
    data.text = !isEmpty(data.text) ? data.text : '';

    if (Validator.isEmpty(data.text)) {
        errors.text = 'text field is required';
    }

    if (!Validator.isLength(data.text, {min: 10, max: 300})) {
        errors.text = 'Post must be between 10 and 300 chatacters';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
