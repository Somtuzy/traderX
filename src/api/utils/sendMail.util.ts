import sanitizeHtml from "sanitize-html";
import { resend } from "@configs/mail.config";
import capitalizeString from "./capitalise.util";

type MailData = {
    from: string;
    to: string | string[];
    subject: string;
    reply_to?: string;
    html: string;
};

export async function sendMail(mailData: MailData) {
    try {
        const { data, error } = await resend.emails.send(mailData);

        if (error) {
            throw new Error(error as unknown as string);
        }

        console.log("sent mail data:", data);
    } catch (error: any) {
        console.log("error sending mail:");
        console.log({ ...error });
    }

}

export function generateHtml(recipient: string, body: string) {
    // Sanitize and replace line breaks with <br> tags
    const safeBody = sanitizeHtml(body, {
        allowedTags: ["b", "i", "strong", "em", "br"],
        allowedAttributes: {}
    }).replace(/\n/g, "<br>");

    return `<!doctype html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #2e2828; color: #333;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #bbdcf0; margin: 20px auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                <td style="padding: 50px 30px;">
                    <p style="margin: 0 0 10px;">Hello ${capitalizeString(recipient)},</p>
                    <br>
                    <p style="margin: 0 0;">${safeBody}</p>
                    <br>
                    <br>
                    <p style="margin: 0;">Best regards,</p>
                    <p style="margin: 5px 0 0;"><strong>The GoldenCoin Team</strong></p>
                </td>
                </tr>
            </table>
            </body>
        </html>`;
}
