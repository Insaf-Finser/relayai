export declare const ROLES_KEY = "roles";
export type AppRole = 'CUSTOMER' | 'AGENT' | 'ADMIN';
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
