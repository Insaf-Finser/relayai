import { PrismaService } from "./prisma/prisma.service.js";
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        database: string;
        service: string;
    }>;
}
