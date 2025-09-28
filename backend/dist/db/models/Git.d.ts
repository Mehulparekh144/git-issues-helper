import { Schema } from "mongoose";
export declare const Git: import("mongoose").Model<{
    repoURL: string;
    files: import("mongoose").Types.DocumentArray<{
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }> & {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }>;
    issues: import("mongoose").Types.DocumentArray<{
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }> & {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }>;
    name?: string | null;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    repoURL: string;
    files: import("mongoose").Types.DocumentArray<{
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }> & {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }>;
    issues: import("mongoose").Types.DocumentArray<{
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }> & {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }>;
    name?: string | null;
}, {}, import("mongoose").DefaultSchemaOptions> & {
    repoURL: string;
    files: import("mongoose").Types.DocumentArray<{
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }> & {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }>;
    issues: import("mongoose").Types.DocumentArray<{
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }> & {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }>;
    name?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    repoURL: string;
    files: import("mongoose").Types.DocumentArray<{
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }> & {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }>;
    issues: import("mongoose").Types.DocumentArray<{
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }> & {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }>;
    name?: string | null;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    repoURL: string;
    files: import("mongoose").Types.DocumentArray<{
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }> & {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }>;
    issues: import("mongoose").Types.DocumentArray<{
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }> & {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }>;
    name?: string | null;
}>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<{
    repoURL: string;
    files: import("mongoose").Types.DocumentArray<{
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }> & {
        vector: number[];
        filePath?: string | null;
        summary?: string | null;
    }>;
    issues: import("mongoose").Types.DocumentArray<{
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }> & {
        vector: number[];
        summary?: string | null;
        title?: string | null;
        description?: string | null;
        ai_answer?: string | null;
    }>;
    name?: string | null;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Git.d.ts.map