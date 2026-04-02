import { PrismaService } from "../../../src/prisma/prisma.service";

describe("PrismaService (unit)", () => {
  it("onModuleInit: calls $connect", async () => {
    const prisma = new PrismaService();
    (prisma as any).$connect = jest.fn().mockResolvedValue(undefined);
    await prisma.onModuleInit();
    expect((prisma as any).$connect).toHaveBeenCalled();
  });

  it("enableShutdownHooks: enables shutdown hooks on app", async () => {
    const prisma = new PrismaService();
    const app = { enableShutdownHooks: jest.fn() } as any;
    await prisma.enableShutdownHooks(app);
    expect(app.enableShutdownHooks).toHaveBeenCalled();
  });
});
