export const DEFAULT_SELECTED_DOMAIN = 'robo-logic';
export const DEFAULT_SELECTED_DIFFICULTY = 'beginner';
export const DEFAULT_AVATAR = '🦖';

const normalizeHeroName = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '') || 'hero';

export const heroNameToEmail = (heroName) => `${normalizeHeroName(heroName)}@bitbuds.local`;

export const apiUserToProgress = (user, overrides = {}) => {
  const displayName = user.fullName?.trim() || `${user.firstName} ${user.lastName}`;

  return {
    points: user.xp,
    currentLevel: user.level,
    unlockedLevel: user.level,
    selectedDomain: overrides.selectedDomain ?? DEFAULT_SELECTED_DOMAIN,
    selectedDifficulty: overrides.selectedDifficulty ?? DEFAULT_SELECTED_DIFFICULTY,
    avatar: overrides.avatar ?? user.profilePicture ?? DEFAULT_AVATAR,
    username: overrides.username ?? displayName,
  };
};
