import Joi from 'joi';

export const missionSchema = Joi.object({
    title: Joi.string().required().max(100).trim(),
    description: Joi.string().required().max(500).trim(),
    category: Joi.string()
        .required()
        .valid('basics', 'loops', 'conditionals', 'functions', 'arrays', 'objects', 'events', 'animations'),
    difficulty: Joi.string()
        .required()
        .valid('Beginner', 'Intermediate', 'Advanced'),
    topics: Joi.array().items(Joi.string().trim()),
    duration: Joi.number().required().min(5).max(120),
    xpReward: Joi.number().required().min(0),
    order: Joi.number().min(0),
    prerequisites: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    content: Joi.object({
        instructions: Joi.string().required(),
        hints: Joi.array().items(Joi.string()),
        solution: Joi.string(),
        testCases: Joi.array().items(
            Joi.object({
                input: Joi.any(),
                expectedOutput: Joi.any(),
            })
        ),
    }).required(),
    thumbnail: Joi.string().uri(),
    badgeReward: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    isActive: Joi.boolean(),
});

export const missionSubmissionSchema = Joi.object({
    userCode: Joi.string(),
    testResults: Joi.array().items(
        Joi.object({
            testCase: Joi.number(),
            passed: Joi.boolean(),
        })
    ),
    passed: Joi.boolean(),
    timeSpent: Joi.number().min(0),
});
