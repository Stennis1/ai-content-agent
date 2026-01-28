import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { generateDraft } from "../agents/contentAgent";
import {
  saveContent,
  getAllContent
} from "../storage/contentStore";

import { getAllMedia } from "../storage/mediaStore";

import {
  ContentState,
  ActorRole
} from "../workflows/stateMachine";

import { transitionContentState } from "../workflows/transition";

export const contentRouter = Router();

/**
 * Generate AI draft content
 * Creates content in DRAFT state only
 * Media-aware (via descriptions)
 */
contentRouter.post("/draft", async (req, res) => {
  try {
    const { platform } = req.body;

    // Pull uploaded media and pass as context
    const mediaContext = getAllMedia().map(m => ({
      description: m.description || m.originalName
    }));

    const draft = await generateDraft({
      ...req.body,
      mediaContext
    });

    if (!draft || typeof draft !== "object") {
      throw new Error("Invalid AI response");
    }

    const content = {
      id: uuidv4(),
      platform: draft.platform || platform,
      caption: draft.caption || "",
      status: ContentState.DRAFT
    };

    saveContent(content);

    res.json(content);
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Failed to generate draft"
    });
  }
});

/**
 * Get all content
 */
contentRouter.get("/", (_req, res) => {
  res.json(getAllContent());
});

/**
 * Submit content for human review
 * DRAFT → UNDER_REVIEW
 */
contentRouter.post("/:id/submit", (req, res) => {
  try {
    const updated = transitionContentState(
      req.params.id,
      ContentState.UNDER_REVIEW,
      {
        actorRole: ActorRole.REVIEWER,
        reason: "Submitted for review"
      }
    );

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Failed to submit for review"
    });
  }
});

/**
 * Approve content
 * UNDER_REVIEW → APPROVED
 */
contentRouter.post("/:id/approve", (req, res) => {
  try {
    const updated = transitionContentState(
      req.params.id,
      ContentState.APPROVED,
      {
        actorRole: ActorRole.REVIEWER,
        reason: "Approved by reviewer"
      }
    );

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Failed to approve content"
    });
  }
});

/**
 * Reject content
 * UNDER_REVIEW → REJECTED
 */
contentRouter.post("/:id/reject", (req, res) => {
  try {
    const updated = transitionContentState(
      req.params.id,
      ContentState.REJECTED,
      {
        actorRole: ActorRole.REVIEWER,
        reason: req.body?.reason || "Rejected by reviewer"
      }
    );

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Failed to reject content"
    });
  }
});

/**
 * Manually post approved content (mocked)
 * APPROVED → POSTED
 */
contentRouter.post("/:id/post", (req, res) => {
  try {
    const { platform } = req.body;

    const updated = transitionContentState(
      req.params.id,
      ContentState.POSTED,
      {
        actorRole: ActorRole.SYSTEM,
        reason: `Manually posted to ${platform}`
      }
    );

    console.log(
      `[MOCK POST] Posted content ${req.params.id} to ${platform}`
    );

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Failed to post content"
    });
  }
});
