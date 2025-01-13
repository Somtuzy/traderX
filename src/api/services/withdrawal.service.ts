import { Model } from "mongoose";
import { Withdrawal } from "@models";
import GenericService from "./generic.service";
import {
    NotFoundException,
    ForbiddenException,
    UnAuthorizedException,
    InternalException
} from "./error.service";
import { userService } from "@services";
import { ICreateWithdrawal, IWithdrawal, IUser } from "@interfaces";
import { isAuthorised } from "@utils";
import { generateHtml, sendMail } from "@utils/sendMail.util";

export class WithdrawalService<T extends IWithdrawal> extends GenericService<T> {
    constructor(model: Model<T>) {
        super(model);
        this.model = model;
    }

    async create(data: T | ICreateWithdrawal) {
        return new this.model(data);
    }

    async confirmWithdrawal(requestUser: IUser, withdrawalId: string, status: string) {
        const isAllowed = isAuthorised(requestUser, "role", "admin")
        if (!isAllowed) {
            throw new UnAuthorizedException(`You cannot do this.`)
        }

        const withdrawal = await this.updateOne({ _id: withdrawalId, status: "pending" }, { status });

        if (!withdrawal) {
            throw new NotFoundException(`Withdrawal not found`)
        }

        if (status === "rejected") {
            return {
                message: `Withdrawal rejected successfully!`,
                withdrawal
            };
        }

        const user = await userService.updateOne(
            { _id: (withdrawal.user as IUser)._id },
            { $inc: { balance: - withdrawal.amount } })

        if (!user) {
            throw new NotFoundException(`User not found`)
        }

        return {
            message: `Withdrawal successful!`,
            user: user.toJSON()
        };
    }

    async disableWithdrawal(_id: string, user: IUser) {
        const withdrawal = await this.findOne({ _id });

        if (!withdrawal) {
            throw new NotFoundException(`This withdrawal does not exist`)
        }

        const isAllowed = isAuthorised(user, "role", "admin")

        if (!isAllowed) {
            throw new UnAuthorizedException(`You do not have permission to delete this withdrawal`)
        }

        const disabledWithdrawal = await this.disableOne({ _id });
        if (!disabledWithdrawal) {
            throw new InternalException("There was an error deleting withdrawal")
        }

        return {
            message: `Withdrawal deleted successfully!`
        }
    }

    async getWithdrawal(query: any, user: IUser) {
        if (user.role !== "admin") {
            query = { ...query, user: (user as IUser)._id };
        }

        const withdrawal = await this.findOne(query);

        if (!withdrawal) {
            throw new NotFoundException(`Deposit does not exist`)
        }

        return {
            message: `Withdrawal fetched successfully!`,
            withdrawal
        }
    }

    async getWithdrawals(query: any, user: IUser) {
        const { id, isDeleted } = query;

        if (id) {
            delete query.id;
            query._id = id;
        }

        if (typeof isDeleted === "boolean") {
            query.isDeleted = isDeleted;
        }

        if (user.role !== "admin") {
            query = { ...query, user: (user as IUser)._id }
        }

        const {
            data: withdrawals,
            currentPage,
            totalPages,
        } = await this.findAll(query);

        if (!withdrawals) {
            throw new InternalException()
        }

        return {
            message: withdrawals.length > 0 ? "Withdrawals successfully fetched" : "No withdrawals match your search criteria.",
            withdrawals,
            currentPage,
            totalPages
        }
    }


    async withdraw(requestUser: IUser, walletAddress: string, network: string, amount: number) {
        const { _id, email } = requestUser
        const { user } = await userService.getUser({ _id })

        if (user.balance < amount) {
            throw new ForbiddenException(`Insufficient balance`)
        }

        const withdrawal = await this.create({
            user: user._id,
            amount,
            walletAddress
        })

        await withdrawal.save()
        
        let body = `Your withdrawal requeest of $${amount} is processing and will be credited to your wallet address soon. `

        console.log("USSER:", user.email);
        
        await sendMail({
            to: user.email,
            subject: "Withdrawal Request",
            body,
            html: generateHtml(user.firstName, body)
        })

        body = `A user with email: ${email} has requested to withdraw ${amount} with the details below:\n Wallet: ${walletAddress}\n Network: ${network}.`

        await sendMail({
            to: "somto.onyeka@yahoo.com",
            subject: "Withdrawal Request",
            replyTo: user.email,
            body,
            html: generateHtml("Admin", body)
        })

        return {
            message: `Withdrawal request sent successfully!`,
            withdrawal
        };
    }
}

export default new WithdrawalService(Withdrawal);