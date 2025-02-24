import { Model } from "mongoose";
import { Deposit } from "@models";
import GenericService from "./generic.service";
import {
    NotFoundException,
    UnAuthorizedException,
    InternalException
} from "./error.service";
import { ICreateDeposit, IDeposit, IUser } from "@interfaces";
import { isAuthorised, generateHtml, sendMail } from "@utils";
import userService from "./user.service";
import { MAIL_DOMAIN as domain, ADMINS } from "@configs";

export class DepositService<T extends IDeposit> extends GenericService<T> {
    constructor(model: Model<T>) {
        super(model);
        this.model = model;
    }

    async create(data: T | ICreateDeposit) {
        return new this.model(data);
    }

    async deposit(requestUser: IUser, walletAddress: string, walletNetwork: string, coinType: string, amount: number) {
        const { user } = await userService.getUser({ _id: requestUser._id })

        const deposit = await this.create({
            user: user._id,
            amount,
            wallet: {
                walletAddress,
                walletNetwork,
                coinType
            }
        })

        await deposit.save()

        let body = `Your deposit request of $${amount} is processing and will reflect on your dashboard balance once approved.`

        console.log("USSER:", user.email);

        await sendMail({
            to: user.email,
            subject: "Deposit Request",
            from: `The GoldenCoin Team <no-reply@${domain}>`,
            html: generateHtml(user.firstName, body)
        })

        body = `A user with email: ${user.email} has requested to deposit $${amount} into their dashboard balance.\n\n\n Please check your wallet transactions for $${amount} worth of ${coinType} from ${walletAddress} and login to mongo compass to approve their deposit as soon as you receive coins.`

        const admins = ADMINS.split(",")
        await sendMail({
            to: admins,
            subject: "Deposit Request",
            from: `Admin <admin@${domain}>`,
            reply_to: user.email,
            html: generateHtml("Admin", body)
        })


        return {
            message: `Deposit request sent successfully!`,
            deposit
        };
    }

    async confirmDeposit(requestUser: IUser, depositId: string, status: string) {
        const isAllowed = isAuthorised(requestUser, "role", "admin")
        if (!isAllowed) {
            throw new UnAuthorizedException(`You cannot do this.`)
        }

        const deposit = await this.updateOne({ _id: depositId, status: "pending" }, { status });
        if (!deposit) {
            throw new NotFoundException(`Deposit not found`)
        }

        if (status === "rejected") {
            return {
                message: `Deposit rejected successfully!`,
                deposit
            };
        }

        const user = await userService.updateOne(
            { _id: (deposit.user as IUser)._id },
            { $inc: { balance: deposit.amount } })

        if (!user) {
            throw new NotFoundException(`User not found`)
        }

        const message = `You have successfully deposited $${deposit.amount} into your dashboard balance!`
        await sendMail({
            to: user.email,
            subject: "Deposit Successful",
            from: `The GoldenCoin Team <no-reply@${domain}>`,
            html: generateHtml(user.firstName, message)
        })

        return {
            message: `User updated successfully!`,
            user: user.toJSON()
        };
    }

    async disableDeposit(_id: string, user: IUser) {
        const deposit = await this.findOne({ _id });

        if (!deposit) {
            throw new NotFoundException(`This deposit does not exist`)
        }

        const isAllowed = isAuthorised(user, "role", "admin")

        if (!isAllowed) {
            throw new UnAuthorizedException(`You do not have permission to delete this deposit`)
        }

        const disabledDeposit = await this.disableOne({ _id });
        if (!disabledDeposit) {
            throw new InternalException("There was an error deleting deposit")
        }

        return {
            message: `Deposit deleted successfully!`
        }
    }

    async getDeposit(query: any, user: IUser) {
        if (user.role !== "admin") {
            query = { ...query, user: (user as IUser)._id };
        }

        const deposit = await this.findOne(query);

        if (!deposit) {
            throw new NotFoundException(`Deposit does not exist`)
        }

        return {
            message: `Deposit fetched successfully!`,
            deposit
        }
    }

    async getDeposits(query: any, user: IUser) {
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
            data: deposits,
            currentPage,
            totalPages,
        } = await this.findAll(query);

        if (!deposits) {
            throw new InternalException()
        }

        return {
            message: deposits.length > 0 ? "Deposits successfully fetched" : "No deposits match your search criteria.",
            deposits,
            currentPage,
            totalPages
        }
    }
}

export default new DepositService(Deposit);