import { ContentState, ActorRole } from "./stateMachine";
import { systemConfig } from "../config/systemConfig";

export function isTransitionAllowedBySystem(
    targetState: ContentState,
    actorRole: ActorRole,
): boolean {
    if (systemConfig.CRISIS_MODE) {
        return targetState === ContentState.SUPPRESSED;
    }

    if (systemConfig.SYSTEM_STATUS === "PAUSED") {
        return false;
    }

    if (actorRole === ActorRole.AI) {
        return false;
    }

    return true;
}