import { Request, Response } from "express";
import { sendResponse } from "@utils";
import { withdrawalService } from "@services";
import { IUser } from "@interfaces";

class WithdrawalController {
    async withdraw(req: Request, res: Response) {
        const user = req.user as unknown as IUser;
        const { walletAddress, walletNetwork, coinType, amount } = req.body

        const response = await withdrawalService.withdraw(user, walletAddress, walletNetwork, coinType, amount)

        return sendResponse(res, 200, true, response.message);
    }

    async confirm(req: Request, res: Response) {
            const { id } = req.params
            const { status } = req.body
            const user = req.user as unknown as IUser;
    
            const response = await withdrawalService.confirmWithdrawal(user, id, status)
    
            return sendResponse(res, 201, true, response.message, response.user);
        }
    

    async getOne(req: Request, res: Response) {
            const { id: _id } = req.params;
            const user = req.user as unknown as IUser
    
            const response = await withdrawalService.getWithdrawal({ _id }, user)
    
            return sendResponse(res, 200, true, response.message, response.withdrawal);
        }
    
        async getMany(req: Request, res: Response) {
            const query = req.query
            const user = req.user as unknown as IUser
    
            const response = await withdrawalService.getWithdrawals(query, user)
    
            return sendResponse(res, 200, true, response.message, {
                deposits: response.withdrawals,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
            });
        }
    
        async deleteOne(req: Request, res: Response) {
            const { id: _id } = req.params;
            const user = req.user as unknown as IUser
    
            const response = await withdrawalService.disableWithdrawal(_id, user)
    
            return sendResponse(res, 200, true, response.message);
        }
}

export default new WithdrawalController();