import { ContentState } from "../workflows/stateMachine";

export interface ContentItem {
  id: string;
  platform: string;
  caption: string;
  status: ContentState;
}

const contentStore = new Map<string, ContentItem>();

export function saveContent(item: ContentItem) {
  contentStore.set(item.id, item);
}

export function getContent(id: string) {
  return contentStore.get(id);
}

export function getAllContent() {
  return Array.from(contentStore.values());
}
