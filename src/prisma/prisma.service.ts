import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super(); // Chama o construtor de PrismaClient
     }
   async onModuleInit() {
      await this.$connect();
   }
    $connect() {
        throw new Error("Method not implemented.");
    }

   async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as Parameters<PrismaClient['$on']>[0], async () => {
        await app.close();
     });
   }
    $on(arg0: unknown, arg1: () => Promise<void>) {
        throw new Error("Method not implemented.");
    }
}