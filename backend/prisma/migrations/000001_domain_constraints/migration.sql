ALTER TABLE "hero_profiles"
  ADD CONSTRAINT "hero_profiles_age_check" CHECK ("age" BETWEEN 6 AND 14),
  ADD CONSTRAINT "hero_profiles_current_level_check" CHECK ("current_level" >= 1),
  ADD CONSTRAINT "hero_profiles_cached_total_xp_check" CHECK ("cached_total_xp" >= 0);

ALTER TABLE "progress"
  ADD CONSTRAINT "progress_completion_percent_check" CHECK ("completion_percent" BETWEEN 0 AND 100),
  ADD CONSTRAINT "progress_best_score_check" CHECK ("best_score" IS NULL OR "best_score" BETWEEN 0 AND 100);

ALTER TABLE "xp_events"
  ADD CONSTRAINT "xp_events_amount_positive_check" CHECK ("amount" > 0);

ALTER TABLE "chapters"
  ADD CONSTRAINT "chapters_xp_reward_nonnegative_check" CHECK ("xp_reward" >= 0);

ALTER TABLE "badges"
  ADD CONSTRAINT "badges_xp_bonus_nonnegative_check" CHECK ("xp_bonus" >= 0);

ALTER TABLE "daily_missions"
  ADD CONSTRAINT "daily_missions_xp_reward_nonnegative_check" CHECK ("xp_reward" >= 0);
