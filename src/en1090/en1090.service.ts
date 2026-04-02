import { Injectable, NotFoundException } from "@nestjs/common";
import { existsSync } from "fs";
import { mkdir, readFile, readdir, stat, writeFile } from "fs/promises";
import { dirname, join, normalize, relative, resolve, sep } from "path";

import { PrismaService } from "../prisma/prisma.service";

export type En1090TreeNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: En1090TreeNode[];
};

@Injectable()
export class En1090Service {
  private readonly rootDir = this.resolveEn1090Root();
  constructor(private readonly prisma: PrismaService) {}

  async getFilesTree(): Promise<En1090TreeNode[]> {
    return this.buildTree(this.rootDir);
  }

  async getMarkdownFileContent(requestedPath: string): Promise<string> {
    const absolutePath = this.resolveSafePath(requestedPath);
    const fileStats = await stat(absolutePath).catch(() => null);
    if (!fileStats || !fileStats.isFile()) {
      throw new NotFoundException("File EN1090 non trovato");
    }
    if (!absolutePath.toLowerCase().endsWith(".md")) {
      throw new NotFoundException("Sono consentiti solo file markdown");
    }
    return readFile(absolutePath, "utf8");
  }

  async updateMarkdownFile(
    requestedPath: string,
    content: string,
    context?: { aziendaId?: string | null; userId?: string },
  ): Promise<{ path: string; success: true }> {
    const absolutePath = this.resolveSafePath(requestedPath);
    const fileStats = await stat(absolutePath).catch(() => null);
    if (!fileStats || !fileStats.isFile()) {
      throw new NotFoundException("File EN1090 non trovato");
    }
    const previous = await readFile(absolutePath, "utf8");
    if (context?.aziendaId && context?.userId) {
      await this.prisma.en1090DocumentVersion.create({
        data: {
          aziendaId: context.aziendaId,
          path: requestedPath,
          content: previous,
          userId: context.userId,
        },
      });
    }
    await writeFile(absolutePath, content, "utf8");
    return { path: requestedPath, success: true };
  }

  getFileVersions(path: string, aziendaId: string) {
    return this.prisma.en1090DocumentVersion.findMany({
      where: { path, aziendaId },
      orderBy: { createdAt: "desc" },
    });
  }

  getFileVersionById(id: string, aziendaId: string) {
    return this.prisma.en1090DocumentVersion.findFirst({
      where: { id, aziendaId },
    });
  }

  async writeMarkdownUnderRoot(
    relativePath: string,
    content: string,
  ): Promise<string> {
    const absolutePath = this.resolveSafePath(relativePath);
    const dir = dirname(absolutePath);
    await mkdir(dir, { recursive: true });
    await writeFile(absolutePath, content, "utf8");
    return absolutePath;
  }

  async readMarkdownUnderRoot(relativePath: string): Promise<string> {
    const absolutePath = this.resolveSafePath(relativePath);
    return readFile(absolutePath, "utf8");
  }

  getRootDir(): string {
    return this.rootDir;
  }

  private resolveEn1090Root(): string {
    const candidates = [
      join(process.cwd(), "EN1090"),
      join(process.cwd(), "..", "EN1090"),
    ];
    for (const candidate of candidates) {
      try {
        const normalized = resolve(candidate);
        if (existsSync(normalized)) return normalized;
      } catch {
        // Ignore and continue trying candidates.
      }
    }
    throw new NotFoundException("Cartella EN1090 non trovata nel workspace");
  }

  private resolveSafePath(requestedPath: string): string {
    const cleaned = requestedPath.replace(/\\/g, "/").replace(/^\/+/, "");
    const absolutePath = resolve(this.rootDir, cleaned);
    const relativeToRoot = relative(this.rootDir, absolutePath);
    if (
      relativeToRoot.startsWith("..") ||
      relativeToRoot.includes(`..${sep}`) ||
      relativeToRoot === "" ||
      relativeToRoot === "."
    ) {
      throw new NotFoundException("Percorso file non valido");
    }
    return absolutePath;
  }

  private async buildTree(dir: string): Promise<En1090TreeNode[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const visible = entries
      .filter((entry) => !entry.name.startsWith("."))
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name, "it");
      });

    const nodes: En1090TreeNode[] = [];
    for (const entry of visible) {
      const abs = join(dir, entry.name);
      const rel = normalize(relative(this.rootDir, abs)).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        nodes.push({
          name: entry.name,
          path: rel,
          type: "directory",
          children: await this.buildTree(abs),
        });
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        nodes.push({ name: entry.name, path: rel, type: "file" });
      }
    }
    return nodes;
  }
}
