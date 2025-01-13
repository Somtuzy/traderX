import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { MAIL_ADDRESS as sender } from "@configs";
import { mailers } from "@configs/mail.config";
import capitalizeString from "./capitalise.util";

type MailData = {
    // from: string;
    to: string | string[];
    subject: string;
    replyTo?: string;
    // sender: string;
    body: string;
    html: string;
};

// Track the mailer keys and current index
const mailerKeys = Object.keys(mailers);
let currentMailerIndex = 0;

// Helper to get the next mailer key
function getNextMailerKey() {
    const mailerKey = mailerKeys[currentMailerIndex] as "resend" | "nodemailer";
    currentMailerIndex = (currentMailerIndex + 1) % mailerKeys.length;
    return mailerKey;
}

export async function sendMail(mailData: MailData) {
    try {
        const mailerKey = getNextMailerKey();
        const mailer = mailers[mailerKey];

        if (mailerKey === "resend") {
            const resend = mailer as Resend
            const { data, error } = await resend.emails.send({
                ...mailData,
                from: "The Trading Team <onboarding@tehcville.com>",
                // from: `Team <${sender}>`
            });

            if (error) {
                throw new Error(error as unknown as string);
            }

            console.log("sent mail data:", data);
        }

        if (mailerKey === "nodemailer") {
            const transporter = mailer as Transporter<SMTPTransport.SentMessageInfo>;
            const data = await transporter.sendMail({
                ...mailData,
                sender
            });

            console.log("sent mail data:", data);
        }

        console.log(`Email sent successfully via ${mailerKey}`);
    } catch (error: any) {
        console.log("error sending mail:", error.message);
    }

}

export function generateHtml(recipient: string, body: string) {
    const safeBody = sanitizeHtml(body, { allowedTags: ["b", "i", "strong", "em"], allowedAttributes: {} });
    return `<!doctype html>
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            </head>
            <body style="font-family: sans-serif;">
                <div style="display: block; margin: auto; max-width: 600px;" class="main">
                    <div>
                        <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Hello ${capitalizeString(recipient)},</h1>
                        ${safeBody}
                    </div>
                    <div>
                        <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">The Trading Team</h1>
                    </div>
                </div>
            </body>
        </html>`;
}
