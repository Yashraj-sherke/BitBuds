import Joi from 'joi';

export const badgeSchema = Joi.object({
    name: Joi.string().required().max(100).trim(),
    description: Joi.string().required().max(300).trim(),
    icon: Joi.string().required(),
    category: Joi.string()
        .required()
        .valid('mission_completion', 'streak', 'xp_milestone', 'skill_mastery', 'special_achievement', 'social'),
    rarity: Joi.string().valid('Common', 'Rare', 'Epic', 'Legendary'),
    criteria: Joi.object({
        type: Joi.string()
            .required()
            .valid(
                'complete_missions',
                'earn_xp',
                'maintain_streak',
                'master_category',
                'complete_all_beginner',
                'complete_all_intermediate',
                'complete_all_advanced',
                'custom'
            ),
        value: Joi.number(),
        category: Joi.string(),
        customLogic: Joi.string(),
    }).required(),
    xpReward: Joi.number().min(0),
    isActive: Joi.boolean(),
    order: Joi.number().min(0),
});
