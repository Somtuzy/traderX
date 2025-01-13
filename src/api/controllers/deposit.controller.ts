import { Request, Response } from "express";
import { sendResponse } from "@utils";
import { IUser } from "@interfaces";
import { depositService } from "@services";

class DepositController {
    async confirm(req: Request, res: Response) {
        const { id } = req.params
        const { status } = req.body
        const user = req.user as unknown as IUser;

        const response = await depositService.confirmDeposit(user, id, status)

        return sendResponse(res, 201, true, response.message, response.user);
    }

    async deposit(req: Request, res: Response) {
        const user = req.user as unknown as IUser;
        const { amount, walletAddress } = req.body

        const response = await depositService.deposit(user, walletAddress, amount)

        return sendResponse(res, 200, true, response.message, response.deposit);
    }

    async getOne(req: Request, res: Response) {
        const { id: _id } = req.params;
        const user = req.user as unknown as IUser

        const response = await depositService.getDeposit({ _id }, user)

        return sendResponse(res, 200, true, response.message, response.deposit);
    }

    async getMany(req: Request, res: Response) {
        const query = req.query
        const user = req.user as unknown as IUser

        const response = await depositService.getDeposits(query, user)

        return sendResponse(res, 200, true, response.message, {
            deposits: response.deposits,
            currentPage: response.currentPage,
            totalPages: response.totalPages,
        });
    }

    async deleteOne(req: Request, res: Response) {
        const { id: _id } = req.params;
        const user = req.user as unknown as IUser

        const response = await depositService.disableDeposit(_id, user)

        return sendResponse(res, 200, true, response.message);
    }
}

export default new DepositController();
