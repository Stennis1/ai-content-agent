export enum ContentState {
    DRAFT = "DRAFT",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SCHEDULED = "SCHEDULED",
    POSTED = "POSTED",
    SUPPRESSED = "SUPPRESSED"
}

export enum ActorRole{
    AI = "AI",
    REVIEWER = "REVIEWER",
    ADMIN = "ADMIN",
    SYSTEM = "SYSTEM"
}

export interface TransitionContext {
    actorRole: ActorRole;
    reason?: string;
}

export const ALLOWED_TRANSITIONS: Record<ContentState, ContentState[]> = {
    DRAFT: [ContentState.UNDER_REVIEW],
    UNDER_REVIEW: [ContentState.APPROVED, ContentState.REJECTED],
    REJECTED: [ContentState.DRAFT],
    APPROVED: [ContentState.SCHEDULED],
    SCHEDULED: [ContentState.POSTED, ContentState.SUPPRESSED],
    POSTED: [],
    SUPPRESSED: []
}; 