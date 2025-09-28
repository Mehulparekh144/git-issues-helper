import { Document } from "@langchain/core/documents";
export declare const generateSummaryForFile: (file: Document) => Promise<import("@langchain/core/messages").MessageContent>;
export declare const generateSummaryForIssue: (issue: {
    body: string;
    title: string;
}) => Promise<import("@langchain/core/messages").MessageContent>;
//# sourceMappingURL=ai.d.ts.map