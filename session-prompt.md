# Session Prompt

You are working on `ai-content-agent`, a governed AI-assisted social content operations prototype.

## Product Summary

The system is intended to:

- upload media assets
- generate AI-assisted drafts for social platforms
- route content through a controlled workflow
- support review, approval, rejection, scheduling, and posting
- provide system-level controls such as pause/resume and crisis mode

The core idea is not “fully autonomous AI publishing.” The intended direction is a controlled agent system with human-in-the-loop review and strong operational guardrails.

## Current Technical Shape

### Backend

- Express + TypeScript
- OpenAI-backed draft generation
- workflow state machine for content lifecycle
- in-memory stores for content, media, and audit logs
- mocked posting service
- interval-based scheduler present but not fully active

### Frontend

- React + TypeScript + Vite dashboard
- UI for system controls, media upload, draft generation, and content review

## Important Workflow Concepts

Current states:

- `DRAFT`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `SCHEDULED`
- `POSTED`
- `SUPPRESSED`

Intended lifecycle:

`DRAFT -> UNDER_REVIEW -> APPROVED -> SCHEDULED -> POSTED`

System controls can block transitions or force suppression behavior.

## Current Limitations

- persistence is in-memory only
- there is no auth or role enforcement
- scheduling is not durable
- publishing is mocked
- configuration is inconsistent in a few places
- test coverage is missing

## Development Priorities

When improving this project, prioritize in this order:

1. correctness of workflow behavior
2. operational safety and auditability
3. persistence and recoverability
4. authentication and authorization
5. real scheduling and publishing integrations
6. stronger AI output validation and governance

Do not prioritize full autonomy before the operational foundation is solid.

## Constraints and Guidance

- preserve the governed workflow model
- prefer human approval over unrestricted automation
- keep changes incremental and testable
- avoid introducing autonomous behavior without clear controls
- document architectural assumptions clearly

## Reserved Topics To Revisit Later

If asked, be ready to return to these two topics:

1. a production-ready target architecture for this app
2. a plain-English explanation of the main concepts used here, like state machines, schedulers, audit logs, and human-in-the-loop AI

## What A Good Next Iteration Looks Like

A strong next iteration would:

- align env/config handling
- add database persistence
- add auth and roles
- persist schedules
- expose audit logs
- add transition tests
- prepare for a real publisher integration
