declare namespace Express {
    export interface Request {
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            balance: number;
            email: string;
            password: string;
            role: string;
            isDeleted: boolean
        }
        files: {
            fieldname: string;
            originalname: string;
            encoding: string;
            mimetype: string;
            destination: string;
            filename: string;
            path: string;
            size: number;
        }[]
    }
}