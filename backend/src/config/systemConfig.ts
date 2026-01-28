export type SystemStatus = "ACTIVE" | "PAUSED";
export type AiMode = "DRAFT_ONLY" | "DISABLED";

export const systemConfig = {
    SYSTEM_STATUS: "ACTIVE" as SystemStatus,
    AI_MODE: "DRAFT_ONLY" as AiMode,
    CRISIS_MODE: false
}