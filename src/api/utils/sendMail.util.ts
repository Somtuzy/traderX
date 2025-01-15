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
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .main {
                        display: block;
                        margin: auto;
                        max-width: 600px;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        color: #333333;
                    }
                    .body {
                        font-size: 16px;
                        line-height: 1.6;
                        color: #555555;
                        white-space: pre-wrap;
                    }
                    .footer {
                        font-size: 14px;
                        font-weight: bold;
                        margin-top: 20px;
                        color: #333333;
                    }
                </style>
            </head>
            <body>
                <div class="main">
                    <div class="header">
                        Hello ${capitalizeString(recipient)},
                    </div>
                    <div class="body">
                        ${safeBody}
                    </div>
                    <div class="footer">
                        The Trading Team
                    </div>
                </div>
            </body>
        </html>`;
}