import { Content } from "openai/resources/containers/files/content";
import { systemConfig } from "../config/systemConfig";
import { getAllContent } from "../storage/contentStore";
import { ActorRole, ContentState } from "../workflows/stateMachine";
import { transitionContentState } from "../workflows/transition";

export function postApprovedContent(platform: string) {
    if (systemConfig.SYSTEM_STATUS === "PAUSED") return;
    if (systemConfig.CRISIS_MODE) return;

    const contentItems = getAllContent().filter(
        c => c.platform === platform && c.status === ContentState.APPROVED
    );

    contentItems.forEach(content => {
        try {
            transitionContentState(content.id, ContentState.SCHEDULED, {
                actorRole: ActorRole.SYSTEM,
                reason: "Scheduled by automated posting service"
            });

            transitionContentState(content.id, ContentState.POSTED, {
                actorRole: ActorRole.SYSTEM,
                reason: "Mock post published"
            });

            console.log(
                `[POSTED] ${platform.toUpperCase()} | Content ID: ${content.id}`
            );
        } catch (err) {
            console.error("Posting failed: ", err);
        }
    });
}