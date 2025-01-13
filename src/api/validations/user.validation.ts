import Joi from 'joi'
import { checkForRequiredInput, checkMongooseId } from '@utils'

export const UserSchemas = {
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
        }),
    balance: Joi.number()
        .greater(0)
        .label('Balance')
        .messages({
            'number.base': 'Balance must be a valid number.',
            'number.greater': 'Balance must be greater than 0.',
            'number.empty': 'Balance cannot be empty.',
            'any.required': 'Balance is required.'
        }),
    isDeleted: Joi.boolean(),
    page: Joi.number(),
    limit: Joi.number(),
    newPassword: Joi.string().custom((val, obj) => checkForRequiredInput(val, obj, 'password', 'isProvided'))
        .label('New Password')
        .min(8)
        .max(50)
        .messages({
            'string.empty': 'New Password cannot be empty.',
            'string.min': 'New Password must have at least 8 characters.',
            'string.max': 'New Password must have at most 50 characters.',
            'any.required': 'New Password is required.'
        }),
    id: Joi.string().custom(checkMongooseId),
    _id: Joi.string().custom(checkMongooseId)
}

export const UserFields = {
    GetOneUser: {
        params: ["id*"]
    },
    UpdateOneUser: {
        body: [
            "email",
            "firstName",
            "lastName",
            "password",
            "newPassword"
        ],
        params: ["id*"]
    },
    UpdateUserBalancee: {
        body: ["balance*"],
        params: ["id*"]
    },
    DeleteOneUser: {
        params: [
            "id*"
        ]
    },
    GetAllUsers: {
        query: [
            "id",
            "_id",
            "email",
            "fullName",
            "isDeleted",
            "page",
            "limit"
        ]
    }
}