export declare class ResetPasswordSubmitDto {
    email: string;
}
export declare class ResetVerifyDto extends ResetPasswordSubmitDto {
    otp: string;
}
export declare class ProfileResetPasswordDto {
    currentPassword: string;
    password: string;
    confirmPassword: string;
}
export declare class UpdateUserPasswordDto {
    password: string;
    confirmPassword: string;
}
export declare class ResetPasswordDto extends ResetVerifyDto {
    password: string;
    confirmPassword: string;
}
