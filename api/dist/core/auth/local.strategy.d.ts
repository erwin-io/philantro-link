import { AuthService } from "../../services/auth.service";
import { Strategy } from "passport-local";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(userName: any, password: any): Promise<any>;
}
export {};
