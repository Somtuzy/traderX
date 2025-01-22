import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";

// Define investment properties separately from Document
export interface IDepositData {
    user: string | IUser;
    amount: number;
    status?: string;
    wallet: {
        walletAddress: String,
        walletNetwork: String,
        coinType: String
    }
}

export interface IDeposit extends IDepositData, Document {
    _id: string;
    isDeleted: boolean;
}

export type ICreateDeposit = IDepositData;

export interface IUpdateDeposit extends Partial<IDepositData> {
    status: string;
}

// Define withdrawal properties separately from Document
export interface IWithdrawalData {
    user: string | IUser;
    amount: number;
    status?: string;
    wallet: {
        walletAddress: String,
        walletNetwork: String,
        coinType: String
    }
}

export interface IWithdrawal extends IWithdrawalData, Document {
    _id: string;
    isDeleted: boolean;
}

export type ICreateWithdrawal = IWithdrawalData;

export interface IUpdateWithdrawal extends Partial<IWithdrawalData> {
    status: string;
}