interface GitRepoContents {
    summary: string;
    filePath: string;
}
export declare const getGitRepoContents: (repo: string) => Promise<GitRepoContents[]>;
export declare const getGitIssues: (repoURL: string) => Promise<{
    id: number;
    node_id: string;
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    number: number;
    state: string;
    state_reason?: "completed" | "reopened" | "not_planned" | "duplicate" | null;
    title: string;
    body?: string | null;
    user: import("@octokit/openapi-types").components["schemas"]["nullable-simple-user"];
    labels: import("@octokit/openapi-types").OneOf<[string, {
        id?: number;
        node_id?: string;
        url?: string;
        name?: string;
        description?: string | null;
        color?: string | null;
        default?: boolean;
    }]>[];
    assignee: import("@octokit/openapi-types").components["schemas"]["nullable-simple-user"];
    assignees?: import("@octokit/openapi-types").components["schemas"]["simple-user"][] | null;
    milestone: import("@octokit/openapi-types").components["schemas"]["nullable-milestone"];
    locked: boolean;
    active_lock_reason?: string | null;
    comments: number;
    pull_request?: {
        merged_at?: string | null;
        diff_url: string | null;
        html_url: string | null;
        patch_url: string | null;
        url: string | null;
    };
    closed_at: string | null;
    created_at: string;
    updated_at: string;
    draft?: boolean;
    closed_by?: import("@octokit/openapi-types").components["schemas"]["nullable-simple-user"];
    body_html?: string;
    body_text?: string;
    timeline_url?: string;
    type?: import("@octokit/openapi-types").components["schemas"]["issue-type"];
    repository?: import("@octokit/openapi-types").components["schemas"]["repository"];
    performed_via_github_app?: import("@octokit/openapi-types").components["schemas"]["nullable-integration"];
    author_association?: import("@octokit/openapi-types").components["schemas"]["author-association"];
    reactions?: import("@octokit/openapi-types").components["schemas"]["reaction-rollup"];
    sub_issues_summary?: import("@octokit/openapi-types").components["schemas"]["sub-issues-summary"];
    parent_issue_url?: string | null;
    issue_dependencies_summary?: import("@octokit/openapi-types").components["schemas"]["issue-dependencies-summary"];
    issue_field_values?: import("@octokit/openapi-types").components["schemas"]["issue-field-value"][];
}[]>;
export declare const getVectorForIssue: (issue: {
    body: string;
    title: string;
}) => Promise<string>;
export {};
//# sourceMappingURL=git.d.ts.map