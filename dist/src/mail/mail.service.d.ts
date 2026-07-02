export declare class MailService {
    private transporter;
    private readonly logger;
    constructor();
    sendMail(to: string, subject: string, text: string, html?: string): Promise<boolean>;
}
