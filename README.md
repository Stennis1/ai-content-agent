# AI Content Agent

AI Content Agent is a prototype social content operations system with human-in-the-loop governance. It generates draft content with an LLM, routes that content through a controlled review workflow, and exposes operational controls for pausing or suppressing automation.

## What This Project Is

The current system is built around a simple idea:

- upload media assets
- generate AI-assisted social post drafts
- move posts through a governed state machine
- approve, reject, schedule, and eventually publish content
- pause or suppress activity when operations require it

This is closer to a controlled AI workflow system than a fully autonomous agent.

## Current Architecture

### Frontend

React + TypeScript + Vite dashboard in [`frontend`](./frontend).

Main UI modules:

- `SystemControls`: pause/resume/crisis controls
- `MediaUpload`: upload media for prompt context
- `GenerateDraft`: create draft content from an objective
- `ContentList`: review and manage content state

### Backend

Express + TypeScript API in [`backend`](./backend).

Main backend modules:

- `routes/content.ts`: draft generation and state transition endpoints
- `routes/media.ts`: media upload endpoint
- `routes/admin.ts`: operational controls
- `agents/contentAgent.ts`: OpenAI-backed draft generation
- `workflows/stateMachine.ts`: workflow states and allowed transitions
- `workflows/transition.ts`: transition enforcement + audit logging
- `workflows/systemGuards.ts`: pause/crisis/role constraints
- `services/postingService.ts`: mocked publishing flow
- `services/scheduler.ts`: interval-based scheduler
- `storage/*`: in-memory stores for content, media, and audit logs

## Current Content Lifecycle

The intended workflow is:

`DRAFT -> UNDER_REVIEW -> APPROVED -> SCHEDULED -> POSTED`

Additional paths:

- `UNDER_REVIEW -> REJECTED`
- `SCHEDULED -> SUPPRESSED`
- `REJECTED -> DRAFT`

State transitions are guarded by system status and crisis mode.

## Current Status

The application is a working prototype, not a production system.

What works now:

- media upload
- AI draft generation
- in-memory content storage
- review/approve/reject workflow
- system pause/resume/crisis controls
- transition audit logging in memory
- mocked auto-post behavior

What is incomplete:

- no database persistence
- no user authentication or authorization
- no real scheduling persistence
- no real publishing integrations
- no durable job queue
- no test coverage for core workflow behavior
- no production deployment guidance
- inconsistent environment/config handling

## Local Development

### Prerequisites

- Node.js 20+
- npm
- OpenAI API key

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The backend runs on `http://localhost:4000`.

Important:

- [`backend/.env.example`](./backend/.env.example) currently contains `OPEN_API_KEY=`
- [`backend/src/agents/contentAgent.ts`](./backend/src/agents/contentAgent.ts) expects `OPENAI_API_KEY`

These must be aligned before the backend can reliably call OpenAI.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite dev server, typically `http://localhost:5173`.

Important:

- some frontend modules use `import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"`
- [`frontend/src/api.ts`](./frontend/src/api.ts) currently hardcodes a production URL

These should be unified behind one environment-based API configuration.

## Environment Variables

Recommended backend environment variables:

```env
PORT=4000
OPENAI_API_KEY=your_key_here
NODE_ENV=development
```

Recommended frontend environment variables:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## What “Fully Operational” Should Mean

For this project, “fully operational” should mean:

- content survives restarts
- users are authenticated
- roles are enforced
- scheduled jobs are durable
- posts can be published to real channels
- all state changes are auditable
- operational controls are reliable
- failures are observable and recoverable
- tests protect the workflow

## Production-Ready Roadmap

### Phase 1: Stabilize the Prototype

- align environment variable names
- unify frontend API base URL configuration
- remove dead imports and rough edges
- add request validation
- add basic error handling standards
- add health checks for critical dependencies

### Phase 2: Add Persistence

- replace in-memory stores with a database
- persist content items, media metadata, audit logs, schedules, and system settings
- add migration management
- add timestamps and ownership fields

Suggested tables:

- `users`
- `content_items`
- `media_assets`
- `content_media`
- `audit_logs`
- `schedules`
- `system_events`
- `platform_accounts`

### Phase 3: Add Authentication and Authorization

- add login and session/token handling
- introduce roles such as `ADMIN`, `REVIEWER`, and `EDITOR`
- enforce permissions in API routes
- attribute all actions to real users

### Phase 4: Make Scheduling Real

- persist scheduled publish times
- replace `setInterval` scheduling with a durable queue or scheduler
- support retries, idempotency, and backoff
- separate “scheduled” from “ready to publish now”

Good options:

- BullMQ + Redis
- Temporal
- a database-backed scheduled jobs worker

### Phase 5: Add Real Platform Publishing

- integrate with LinkedIn and any other supported channels
- store OAuth credentials securely
- track external post IDs and URLs
- handle platform-specific validation, rate limits, and failures

### Phase 6: Strengthen the AI Layer

- use strict schema validation for model output
- store prompt/version metadata
- add brand voice profiles
- support revision after rejection
- add moderation and policy checks
- log prompt/output events safely

### Phase 7: Add Observability and Testing

- structured logging
- metrics and error monitoring
- integration tests for workflow transitions
- end-to-end tests for major user paths
- alerting for scheduler/publishing failures

## Recommended Product Direction

Do not rush to full autonomy.

The best near-term product shape is a controlled agent system:

- AI proposes
- humans approve
- policies constrain actions
- the system logs everything
- autonomy expands only where trust has been earned

This is a better fit than unrestricted auto-posting for an early-stage social publishing product.

## Near-Term Priority List

If continuing development from the current codebase, the highest-value next steps are:

1. fix configuration inconsistencies
2. add a root-level API/config strategy
3. add a real database
4. add auth + role enforcement
5. implement persistent scheduling
6. add audit log retrieval endpoints
7. add tests for state transitions and system guards
8. wire a real publisher integration

## Reserved Follow-Up Topics

Two topics have been intentionally reserved for later discussion:

1. a production-ready target architecture for this app
2. a plain-English explanation of the main concepts used here, like state machines, schedulers, audit logs, and human-in-the-loop AI
