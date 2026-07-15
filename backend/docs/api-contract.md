# BitBuds API Contract

Base path: `/api/v1`

All protected routes require `Authorization: Bearer <accessToken>`.

## Auth

### `POST /auth/signup`

Creates a parent account and first child hero.

Request:

```json
{
  "email": "parent@example.com",
  "password": "StrongPassword123!",
  "heroName": "Mohan",
  "age": 9,
  "avatarId": "uuid"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "hero": {
    "id": "uuid",
    "heroName": "Mohan",
    "age": 9,
    "currentLevel": 1,
    "totalXp": 0,
    "activeAvatar": {
      "id": "uuid",
      "name": "Dino",
      "imageUrl": "/avatars/dino.png"
    }
  }
}
```

### `POST /auth/login`

Returns access token, rotates refresh token, and returns the default hero summary for the header.

## Header

### `GET /heroes/:heroId/header`

Response:

```json
{
  "heroName": "Mohan",
  "xp": 120,
  "level": 2,
  "activeAvatarId": "uuid",
  "avatars": [
    {
      "id": "uuid",
      "name": "Dino",
      "imageUrl": "/avatars/dino.png",
      "unlocked": true,
      "active": true,
      "unlockRequirement": null
    },
    {
      "id": "uuid",
      "name": "Robot",
      "imageUrl": "/avatars/robot.png",
      "unlocked": false,
      "active": false,
      "unlockRequirement": "Requires 200 XP"
    }
  ]
}
```

### `PATCH /heroes/:heroId/avatar`

Request:

```json
{ "avatarId": "uuid" }
```

Fails with `403` if the avatar is not unlocked for that hero.

## Dashboard

### `GET /dashboard/:heroId`

Response:

```json
{
  "continueStory": {
    "worldId": "uuid",
    "worldName": "Robo Logic",
    "chapterId": "uuid",
    "chapterName": "Loops in the Lab",
    "completionPercent": 40
  },
  "todayMission": {
    "id": "uuid",
    "title": "Fix the Pattern",
    "xpReward": 30,
    "completed": false
  },
  "worlds": [
    {
      "id": "uuid",
      "name": "Robo Logic",
      "thumbnailUrl": "/worlds/robo.png",
      "unlocked": true,
      "unlockRequirement": null
    },
    {
      "id": "uuid",
      "name": "Safari Debug",
      "thumbnailUrl": "/worlds/safari.png",
      "unlocked": false,
      "unlockRequirement": "Unlocks at Level 5"
    }
  ],
  "quickStats": {
    "currentLevel": 2,
    "totalXp": 120,
    "badgeCount": 3,
    "lessonsCompleted": 4
  }
}
```

## Badges

### `GET /heroes/:heroId/badges`

Response:

```json
{
  "badges": [
    {
      "id": "uuid",
      "name": "First Spark",
      "iconUrl": "/badges/spark.png",
      "description": "Complete your first chapter.",
      "requirementText": "Complete 1 lesson",
      "earned": true,
      "earnedAt": "2026-07-15T08:00:00.000Z"
    },
    {
      "id": "uuid",
      "name": "XP Hero",
      "iconUrl": "/badges/xp.png",
      "description": "Reach 200 XP.",
      "requirementText": "Requires 200 XP",
      "earned": false,
      "earnedAt": null
    }
  ]
}
```

## Learning

### `POST /chapters/:chapterId/start`

Creates or updates `Progress` to `IN_PROGRESS`.

### `POST /chapters/:chapterId/complete`

Completes the chapter, awards XP, evaluates badges, and returns the new dashboard/header summary.

### `POST /chapters/:chapterId/quiz-attempts`

Request:

```json
{
  "heroId": "uuid",
  "answers": [
    { "questionId": "q1", "answer": "repeat 4" }
  ]
}
```

Response:

```json
{
  "score": 90,
  "xpAwarded": 45,
  "totalXp": 165,
  "currentLevel": 2,
  "newBadges": []
}
```

The server ignores any submitted score and computes the score from the stored chapter quiz config.
