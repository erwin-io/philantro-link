export declare class AccessPagesDto {
    page: string;
    view: boolean;
    modify: boolean;
    rights: string[];
}
export declare class DefaultAccessDto {
    name: string;
    accessPages: AccessPagesDto[];
}
