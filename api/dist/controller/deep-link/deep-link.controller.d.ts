import { ConfigService } from "@nestjs/config";
import { Response } from "express";
export declare class DeepLinkController {
    private readonly config;
    constructor(config: ConfigService);
    getJsonFile(res: Response): Promise<void>;
}
