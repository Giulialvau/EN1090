export declare function loadHtmlTemplate(filename: string): string;
export declare function escapeHtml(s: string | null | undefined): string;
export declare function formatDateIt(d: Date | string | null | undefined): string;
export declare function formatDateTimeIt(d: Date | string | null | undefined): string;
export declare function applyTemplate(template: string, vars: Record<string, string>): string;
export type RenderPdfOptions = {
    footerNote?: string;
};
export declare function renderHtmlToPdf(html: string, options?: RenderPdfOptions): Promise<Uint8Array>;
