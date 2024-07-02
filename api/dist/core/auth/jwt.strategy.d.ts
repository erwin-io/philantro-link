import { Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/payload.interface";
import { UsersService } from "src/services/users.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
    }>;
}
export {};
