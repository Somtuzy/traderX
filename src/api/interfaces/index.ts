import { Request } from 'express'
import { IUser, ICreateUser, IUpdateUser } from "./user.interface";
import { UploadApiResponse } from 'cloudinary';
import {  IDeposit, ICreateDeposit, IUpdateDeposit, IWithdrawal, ICreateWithdrawal, IUpdateWithdrawal } from './investment.interface';

export interface IGenericObject {
    [key: string]: any
}

export interface CustomRequest extends Request {
    user: IUser;
}

export interface IPaginate {
    currentPage: number;
    totalPages: number
}

export type ICustomValidationFields = (value: any, helpers: any, fieldToCheck: any, valueToCheck: any) => any

export interface IReqFileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number
}

export type IUpload = IReqFileUpload & UploadApiResponse

export type ICollections = IUser | IDeposit | IWithdrawal;

export type ICreateCollections = ICreateUser | ICreateDeposit | ICreateWithdrawal;

export type IUpdateCollections = IUpdateUser | IUpdateDeposit | IUpdateWithdrawal;

export * from "./user.interface";
export * from "./investment.interface";