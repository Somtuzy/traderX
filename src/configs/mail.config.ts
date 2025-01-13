import { Resend } from "resend";
import nodemailer from "nodemailer";
import { RESEND_API_KEY, NODEMAILER_MAIL_USERNAME as user, NODEMAILER_MAIL_PASSWORD as pass } from "./environment.config"

export const mailers = {
    // configuration for resend
    resend: new Resend(RESEND_API_KEY),

    // configuration for nodemailer
    nodemailer: nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user,
            pass,
        },
    })
}