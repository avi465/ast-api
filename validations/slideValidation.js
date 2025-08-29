//validate slide data
const Joi = require('joi');

/**
 * Validates the slide data using Joi schema.
 * @param {Object} data - The slide data to validate.
 * @returns {Object} - The validation result.
 */
const validateSlide = (data) => {
    const schema = Joi.object({
        lesson: Joi.string().required().messages({
            'string.empty': 'Lesson ID is required',
            'any.required': 'Lesson ID is required'
        }),
        file: Joi.string().required().messages({
            'string.empty': 'File ID is required',
            'any.required': 'File ID is required'
        }),
        title: Joi.string().required().messages({
            'string.empty': 'Title is required',
            'any.required': 'Title is required'
        })
    });

    return schema.validate(data);
};

module.exports = {
    validateSlide
};
