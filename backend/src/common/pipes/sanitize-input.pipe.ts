import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

type AnyObject = Record<string, unknown>;

function stripNullBytes(s: string): string {
  return s.replaceAll("\u0000", "");
}

function stripScriptTags(s: string): string {
  // Rimuove <script ...>...</script> e varianti (best-effort, non HTML sanitizer completo).
  return s.replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "");
}

function normalizeString(s: string): string {
  // Normalizza Unicode per ridurre confusione su caratteri “equivalenti”.
  // Non cambia la logica business: preserva il testo, ma lo rende stabile.
  return s.normalize("NFKC");
}

function sanitizeString(value: string): string {
  const trimmed = value.trim();
  return normalizeString(stripScriptTags(stripNullBytes(trimmed)));
}

function sanitizeDeep(value: unknown, depth: number): unknown {
  if (depth > 20) return value; // evita recursion bombs

  if (typeof value === "string") return sanitizeString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;

  if (Array.isArray(value)) return value.map((v) => sanitizeDeep(v, depth + 1));

  if (typeof value === "object") {
    const obj = value as AnyObject;
    const out: AnyObject = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = sanitizeDeep(v, depth + 1);
    }
    return out;
  }

  return value;
}

@Injectable()
export class SanitizeInputPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    // Applichiamo solo a body/query/param (evita side effects su custom payload interni).
    if (!metadata?.type || metadata.type === "custom") return value;

    const sanitized = sanitizeDeep(value, 0);

    // Guardrail: rifiuta payload non-oggetto su body (es. stringa gigante) se arriva come body.
    if (metadata.type === "body") {
      if (
        typeof sanitized === "string" ||
        typeof sanitized === "number" ||
        typeof sanitized === "boolean"
      ) {
        throw new BadRequestException("Invalid request body");
      }
    }

    return sanitized;
  }
}
