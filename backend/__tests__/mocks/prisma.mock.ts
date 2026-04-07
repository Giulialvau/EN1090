import type { PrismaService } from "../../src/prisma/prisma.service";

type Mocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? jest.Mock : T[K];
};

function mockModel() {
  return {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  };
}

/**
 * Mock minimale di PrismaService usato nei test unit.
 * Aggiungere metodi/Model solo quando serve, senza toccare la logica business.
 */
export function createPrismaMock(): Partial<Mocked<PrismaService>> {
  return {
    commessa: mockModel(),
    materiale: mockModel(),
    documento: mockModel(),
    checklist: mockModel(),
    nonConformita: mockModel(),
    audit: mockModel(),
    attrezzatura: mockModel(),
    pianoControllo: mockModel(),
    wps: mockModel(),
    wpqr: mockModel(),
    tracciabilita: mockModel(),
    user: mockModel(),
  } as unknown as Partial<Mocked<PrismaService>>;
}
