export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  type: string;
  description?: string;
  uploadedAt: string;
}

const mediaStore: MediaAsset[] = [];

export function saveMedia(asset: MediaAsset) {
  mediaStore.push(asset);
}

export function getAllMedia(): MediaAsset[] {
  return mediaStore;
}
