import { AuthService } from "src/services/auth.service";
import { ConfigService } from "@nestjs/config";
export declare class VerifyController {
    private authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    get(req: any): Promise<{
        isVerified: true;
        company: string;
        year: string;
        deepLink: string;
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        invalidUrl?: undefined;
        message?: undefined;
        exist?: undefined;
    } | {
        invalidUrl: boolean;
        message: string;
        company: string;
        year: string;
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        isVerified?: undefined;
        deepLink?: undefined;
        exist?: undefined;
    } | {
        invalidUrl: boolean;
        exist: any;
        message: any;
        company: string;
        year: string;
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        isVerified?: undefined;
        deepLink?: undefined;
    }>;
}
