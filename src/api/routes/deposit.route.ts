import { Router } from 'express';
import { depositController } from '@controllers'
import { validate, authenticate } from '@middlewares'
import { InvestmentSchemas, InvestmentFields } from '@validations'

const depositRouter = Router()

depositRouter.post(
    '/new', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.Deposit)], 
    depositController.deposit
)

depositRouter.get(
    '/', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.GetManyDeposits)], 
    depositController.getMany
)

depositRouter.post(
    '/:id/confirm', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.ProcessDeposit)], 
    depositController.confirm
)

depositRouter.get(
    '/:id', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.GetOrDeleteDeposit)], 
    depositController.getOne
)

depositRouter.delete(
    '/:id', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.GetOrDeleteDeposit)], 
    depositController.deleteOne
)

export default depositRouter