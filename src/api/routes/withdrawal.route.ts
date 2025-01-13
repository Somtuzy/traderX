import { Router } from 'express';
import { withdrawalController } from '@controllers'
import { validate, authenticate } from '@middlewares'
import { InvestmentSchemas, InvestmentFields } from '@validations'

const withdrawalRouter = Router()

withdrawalRouter.post(
    '/new', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.Withdraw)], 
    withdrawalController.withdraw
)

withdrawalRouter.get(
    '/', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.GetManyDeposits)], 
    withdrawalController.getMany
)

withdrawalRouter.post(
    '/:id/confirm', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.ProcessDeposit)], 
    withdrawalController.confirm
)

withdrawalRouter.get(
    '/:id', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.GetOrDeleteDeposit)], 
    withdrawalController.getOne
)

withdrawalRouter.delete(
    '/:id', 
    [authenticate, validate(InvestmentSchemas, InvestmentFields.GetOrDeleteDeposit)], 
    withdrawalController.deleteOne
)

export default withdrawalRouter