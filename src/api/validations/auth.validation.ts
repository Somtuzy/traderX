import Joi from 'joi'

export const AuthSchemas = {
    email: Joi.string().email().label('Email').messages({
        'string.email': 'Email must be a valid email address.',
        'string.empty': 'Email cannot be empty.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string()
        .min(6)
        .label('Password')
        .messages({
            'string.min': 'Password must have at least 6 characters.',
            'string.empty': 'Password cannot be empty.',
            'string.base': 'Password must be a string.',
            'any.required': 'Password is required.',
        }),
    firstName: Joi.string()
        .min(2)
        .max(50)
        .label('First Name')
        .messages({
            'string.empty': 'First Name cannot be empty.',
            'string.min': 'First Name must have at least 2 characters.',
            'string.max': 'First Name must have at most 50 characters.',
            'string.base': 'First Name must be a string.',
            'any.required': 'First Name is required.'
        }),
    lastName: Joi.string()
        .min(2)
        .max(50)
        .label('Last Name')
        .messages({
            'string.empty': 'Last Name cannot be empty.',
            'string.min': 'Last Name must have at least 2 characters.',
            'string.max': 'Last Name must have at most 50 characters.',
            'string.base': 'Last Name must be a string.',
            'any.required': 'Last Name is required.'
        })
}

export const AuthFields = {
    Login: {
        body: [
            "email*",
            "password*"
        ]
    },
    Register: {
        body: [
            "firstName*",
            "lastName*",
            "email*",
            "password*"
        ]
    }
}