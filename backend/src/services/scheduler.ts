import { platform } from "node:os";
import { postingPreferences } from "../config/postingPreferences";
import { postApprovedContent } from "./postingService";

export function startScheduler() {
    Object.entries(postingPreferences).forEach(([platform, config]) => {
        if (!config.enabled) return;

        setInterval(() => {
            postApprovedContent(platform);
        }, config.intervalMinutes * 60 * 1000);
    });
}