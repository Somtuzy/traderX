import Joi from 'joi';
import { checkMongooseId } from '@utils';

export const InvestmentSchemas = {
    amount: Joi.number()
        .label('Amount')
        .messages({
            'number.base': 'Amount must be a number.',
            'number.empty': 'Amount cannot be empty.',
            'any.required': 'Amount is required.',
        }),
    status: Joi.string()
        .label('Status')
        .messages({
            'string.base': 'Status must be a string.',
            'string.empty': 'Status cannot be empty.',
            'any.required': 'Status is required.',
        }),
    id: Joi.string()
        .custom(checkMongooseId)
        .label('Deposit ID')
        .messages({
            'string.base': 'Deposit ID must be a string.',
            'any.custom': 'Deposit ID must be a valid MongoDB ObjectId.',
        }),
    walletAddress: Joi.string()
        .min(2)
        .max(50)
        .label('Wallet Address')
        .messages({
            'string.empty': 'Wallet Address cannot be empty.',
            'string.min': 'Wallet Address must have at least 2 characters.',
            'string.max': 'Wallet Address must have at most 50 characters.',
            'string.base': 'Wallet Address must be a string.',
            'any.required': 'Wallet Address is required.',
        }),
    walletNetwork: Joi.string()
        .min(2)
        .max(50)
        .label('Wallet Network')
        .messages({
            'string.empty': 'Wallet Network cannot be empty.',
            'string.min': 'Wallet Network must have at least 2 characters.',
            'string.max': 'Wallet Network must have at most 50 characters.',
            'string.base': 'Wallet Network must be a string.',
            'any.required': 'Wallet Network is required.',
        }),
};

export const InvestmentFields = {
    Deposit: {
        body: ['amount*'],
    },
    ProcessDeposit: {
        body: ['status*'],
        params: ['id*'],
    },
    GetOrDeleteDeposit: {
        params: ['id*'],
    },
    GetManyDeposits: {
        query: ['id', '_id', 'amount', 'status', 'user'],
    },
    Withdraw: {
        body: ['walletAddress*', 'walletNetwork*', 'amount*'],
    },
};
