import { ALLOWED_TRANSITIONS, ContentState, TransitionContext } from "./stateMachine";
import { isTransitionAllowedBySystem } from "./systemGuards";
import { logTransition } from "../storage/auditLog";
import { getContent } from "../storage/contentStore";

export function transitionContentState(
    contentId: string, to: ContentState, context: TransitionContext
) {
    const content = getContent(contentId);

    if (!content) {
        throw new Error("Content not found");
    }

    const from = content.status;

    if (!ALLOWED_TRANSITIONS[from]?.includes(to)) {
        throw new Error(`Invalid transition: ${from} - ${to}`);
    }

    if (!isTransitionAllowedBySystem(to, context.actorRole)) {
        throw new Error("Transition blocked by system controls");
    }

    content.status = to;

    saveContent(content);

    logTransition({
        contentId,
        from,
        to,
        actorRole: context.actorRole,
        reason: context.reason,
        timestamp: new Date().toISOString()
    });

    return content;

}