# BitBuds Backend System Design

## 1. Prisma Schema

The complete Prisma schema lives at [`backend/prisma/schema.prisma`](../prisma/schema.prisma), with the Prisma 7 datasource URL configured in [`backend/prisma.config.ts`](../prisma.config.ts). It models the frontend contract directly:

- Header: `HeroProfile`, `Avatar`, `HeroAvatarUnlock`, `XpEvent`.
- Dashboard: `World`, `Chapter`, `Progress`, `DailyMission`, `HeroBadge`.
- Badge gallery: `Badge` plus `HeroBadge`.
- Login/signup: `User` authenticates the parent/guardian; `HeroProfile` represents the child.
- Future reports, admin content, live quiz: retained by normalized event, content, and attempt tables.

PostgreSQL check constraints that Prisma cannot express directly are in [`backend/prisma/migrations/000001_domain_constraints/migration.sql`](../prisma/migrations/000001_domain_constraints/migration.sql).

## 2. Why

`User` is the parent or guardian because a child under 13 should not be the legal/account-owning identity. This keeps consent, email, OAuth, password recovery, and refresh-token lifecycle tied to the adult account, while `HeroProfile` remains the child-facing game identity.

`User.email` and `User.googleId` are unique because login needs direct lookup by either credential. `passwordHash` is nullable so Google-only accounts do not store dummy secrets. `googleId` stores the stable Google `sub` claim only, never provider tokens. Deleting a `User` cascades to `HeroProfile` because child data belongs to the parent account.

`HeroProfile.userId` is indexed for "show my children" and authorization checks. `age` is constrained to 6-14 at the database layer because age eligibility is a product rule, not merely a form validation. `activeAvatarId` uses `SET NULL` on avatar deletion so an admin can retire an avatar without deleting the hero. `cachedTotalXp` is derived from `XpEvent`; it is updated only in the same transaction that appends an XP ledger row.

`Avatar.unlockRequirement`, `World.unlockRequirement`, `Badge.unlockRule`, `Chapter.storyContent`, `Chapter.activityConfig`, and `Chapter.quizConfig` are JSON because these are admin-authored game/content rules that need to evolve without a deploy. They are not free-form user data; services still validate supported rule shapes before publishing.

`HeroAvatarUnlock` has a composite primary key on `(heroProfileId, avatarId)` so the same avatar cannot be unlocked twice for one hero. Avatar deletion is restricted while unlock records reference it, preserving header history and avoiding broken gallery states.

`World.order` is unique so the map has a deterministic path. `(isPublished, order)` powers the public world map query. `Chapter` has `(worldId, order)` unique and `(worldId, isPublished, order)` indexed for fetching published chapters inside one world. `World` and `Chapter` use `RESTRICT` on delete from child content and progress so admins cannot silently remove content that has learning history.

`Progress` has a composite unique index on `(heroProfileId, chapterId)` because every dashboard and chapter route asks for one hero's state for each chapter. `completionPercent` is constrained to 0-100; `bestScore` is constrained to 0-100 when present. Progress deletes cascade with the hero but restrict chapter deletion.

`XpEvent` is append-only and indexed by `(heroProfileId, createdAt DESC)` for header/dashboard XP history and recent activity. The separate `(reason, createdAt DESC)` index supports reports such as daily mission XP volume. The ledger gives auditability, dispute resolution, and future seasonal/reset mechanics; `cachedTotalXp` is a read optimization, never the source of truth.

`Badge` is indexed by `isActive` because the rewards engine evaluates active badges often. The badges gallery query is "all active badges LEFT JOIN `HeroBadge` for this hero"; rows without a match are locked. `HeroBadge` uses a composite primary key so a hero earns a badge once.

`QuizAttempt` is append-only because attempts are learning/audit history. `(heroProfileId, chapterId, createdAt DESC)` serves recent-attempt and best-score queries per hero/chapter. `(chapterId, score DESC)` is ready for future leaderboards and admin content analytics. Attempts cascade with the hero but restrict chapter deletion.

`DailyMission` and `DailyMissionClaim` support the dashboard's "Today's Mission" without overloading chapters. `missionDate` is unique so only one published daily mission exists per date, and `(heroProfileId, dailyMissionId)` prevents duplicate XP claims.

## 3. NestJS Module Map

This should be built as a modular monolith: one NestJS deployable with strict module boundaries. Microservices would add service discovery, distributed tracing, deployment choreography, and cross-service failure modes before BitBuds has the traffic or team size to benefit.

| Module | Owns | Must not directly query | External dependencies |
| --- | --- | --- | --- |
| `AuthModule` | Email auth, Google OAuth, JWT access tokens, refresh-token rotation, guards | Progress, rewards, quiz tables | Passport, JWT, bcrypt/argon2 |
| `HeroProfileModule` | Parent-scoped hero CRUD, active avatar selection, avatar selector data | XP ledger or badge rules except via service APIs | Auth guard, Prisma |
| `ContentModule` | Worlds, chapters, admin publishing APIs | Hero progress/rewards | RBAC guard, Prisma |
| `ProgressModule` | Chapter start/complete transitions and dashboard progress projection | Badge internals, quiz scoring | Rewards service, Content service |
| `RewardsModule` | XP ledger writes, cached XP updates, badge rule evaluation, badge gallery, quick stats | Quiz answers or chapter configs except via caller payload/service | Redis, Prisma |
| `QuizModule` | Attempt submission, server-side scoring, attempt history | XP writes directly; call Rewards service | Content service, Rewards service |
| `RealtimeModule` | Future Socket.io gateways and leaderboard channels | Core API tables directly in gateway handlers | Socket.io, Redis pub/sub |
| `AiTutorModule` | Future BullMQ jobs for OpenAI/Gemini tutoring | Request thread data except via explicit DTO | BullMQ, Redis, AI provider SDK |

Natural extraction candidates later are `AiTutorModule` and `RealtimeModule` because they are stateless/worker-like, independently scalable, and have different latency and resource profiles from the core CRUD/API path.

## 4. Transactional Flows

Quiz submission:

1. `QuizModule` authenticates the parent and verifies the requested hero belongs to that parent.
2. It loads the chapter quiz config from `ContentModule`.
3. It scores answers server-side. Client-submitted score is ignored.
4. Inside one Prisma transaction, it appends `QuizAttempt`, upserts/updates `Progress.bestScore`, calls `RewardsModule.awardXpTx(...)`, appends `XpEvent`, updates `HeroProfile.cachedTotalXp`, evaluates badge rules, inserts any new `HeroBadge` rows, and writes the new XP/level snapshot to Redis.
5. The response returns score, XP awarded, newly earned badges, cached total XP, and next progress state.

Chapter completion:

1. `ProgressModule` authenticates and authorizes the hero.
2. It verifies the chapter is published and currently startable/completable.
3. Inside one Prisma transaction, it updates `Progress` to `COMPLETED` with `completionPercent = 100`, appends an `XpEvent`, updates `HeroProfile.cachedTotalXp`, evaluates badge rules, inserts earned badges, and performs Redis write-through for the hero summary.
4. The response returns updated continue-story data, XP pill value, level, and badges earned.

Redis is not the source of truth. It caches header/dashboard summaries such as XP, level, active hero, and continue-story projections. Invalidation is write-through: every XP/progress/avatar transaction updates or deletes the hero summary key before returning.

## 5. Three-Stage Scaling Plan

Stage 1: current portfolio/demo scale. Trigger: now. Use one Postgres instance, one Redis instance, one NestJS process, Docker Compose locally, and a single deployed container. Optimize for correctness, clear boundaries, and interview-defensible transactions.

Stage 2: early growth. Trigger: real signups plus query latency, slow dashboard reads, or Prisma/Postgres connection exhaustion. Add PgBouncer because horizontally scaled NestJS plus Prisma pools can overwhelm Postgres connections. Add a read replica for heavy read paths like content and dashboard aggregates. Use Redis more aggressively as read-through cache for hero profile/progress projections. Run multiple NestJS containers behind a load balancer.

Stage 3: product scale. Trigger: multiple schools/districts and concurrent classroom load. Extract `AiTutorModule` workers and `RealtimeModule` gateways first because they are independently scalable and tolerate different deployment settings than the core API. Partition `XpEvent` and `QuizAttempt` by time, monthly or quarterly, because these are append-only high-volume event tables and common queries are recent history/reporting. Consider multi-region only after measured regional latency, data residency, or availability needs justify the complexity.

Current-stage engineering:

- CI/CD: lint, typecheck, unit tests, Prisma validation/migration check, build, deploy.
- Unit-test now: rewards/badge unlock engine and quiz scoring logic, because those are business rules. Do not over-test plain CRUD controllers or generated Prisma calls yet.
- Secrets: `.env` for local development only; deployed secrets come from the host/AWS secret store. Never commit JWT secrets, database URLs, Redis URLs, OAuth client secrets, or AI provider keys.
- Observability: structured JSON logs with request id, user id when available, route, status, duration, and error code. Add `/health` for process health and `/health/ready` for Postgres/Redis readiness.

## 6. Interview Summary

BitBuds uses a modular NestJS monolith backed by PostgreSQL, Prisma, Redis, BullMQ, and Socket.io. The parent is the authenticating identity for COPPA reasons, while each child has a separate hero profile. Learning progress, quiz attempts, badges, avatars, and XP are normalized, with XP stored as an append-only ledger and cached totals updated transactionally for fast header and dashboard reads. Content and unlock rules are data-driven JSON so admins can publish new worlds, stories, quizzes, and badges without redeploying. Quiz scoring and chapter completion run inside Prisma transactions that update progress, append XP, evaluate badges, and refresh Redis together. The system starts simple for portfolio scale, then adds PgBouncer, read replicas, and horizontal API scaling, and only later extracts realtime and AI workers because those have the clearest independent scaling profiles.
