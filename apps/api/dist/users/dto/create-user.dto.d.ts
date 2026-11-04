export declare enum CreateUserRole {
    CUSTOMER = "CUSTOMER",
    AGENT = "AGENT",
    ADMIN = "ADMIN"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    role?: CreateUserRole;
}
