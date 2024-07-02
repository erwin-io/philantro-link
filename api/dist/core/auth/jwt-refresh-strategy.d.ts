import { Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/payload.interface";
import { UsersService } from "../../services/users.service";
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<import("../../db/entities/Users").Users>;
}
export {};
