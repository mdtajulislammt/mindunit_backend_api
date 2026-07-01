export declare class UploadService {
    private readonly logger;
    private useCloudinary;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<string>;
    private uploadLocal;
}
