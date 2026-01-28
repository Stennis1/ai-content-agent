import { ContentState, ActorRole } from "../workflows/stateMachine";

interface AuditEntry {
    contentId: string;
    from: ContentState;
    to: ContentState;
    actorRole: ActorRole;
    timestamp: string;
    reason?: string;
}

const auditLog: AuditEntry[] = [];

export function logTransition(entry: AuditEntry) {
    auditLog.push(entry);
}

export function getAuditLog() {
    return auditLog;
}