import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mission from '../models/Mission.model.js';
import Badge from '../models/Badge.model.js';
import UserStats from '../models/UserStats.model.js';
import connectDB from '../config/database.js';
import logger from './logger.js';

dotenv.config();

const missions = [
    {
        title: 'Code Your First Robot',
        description: 'Learn the basics of coding by controlling a friendly robot!',
        category: 'basics',
        difficulty: 'Beginner',
        topics: ['Variables', 'Commands'],
        duration: 15,
        xpReward: 100,
        order: 1,
        prerequisites: [],
        content: {
            instructions: 'Welcome to your first coding mission! In this mission, you will learn how to give commands to a robot. Use the basic movement blocks to help the robot reach the goal.',
            hints: [
                'Start by dragging a "Move Forward" block',
                'You can stack multiple blocks together',
                'The robot follows your commands in order from top to bottom'
            ],
            solution: JSON.stringify({ blocks: ['move_forward', 'move_forward', 'turn_right', 'move_forward'] }),
        },
        isActive: true,
    },
    {
        title: 'Loop Adventure',
        description: 'Master loops by helping characters repeat actions efficiently.',
        category: 'loops',
        difficulty: 'Beginner',
        topics: ['For Loops', 'While Loops'],
        duration: 20,
        xpReward: 150,
        order: 2,
        prerequisites: [],
        content: {
            instructions: 'Loops help you repeat actions without writing the same code over and over. Use a loop to make the robot move forward 5 times.',
            hints: [
                'Use the "Repeat" block to create a loop',
                'Put the "Move Forward" block inside the loop',
                'Set the loop to repeat 5 times'
            ],
            solution: JSON.stringify({ blocks: [{ type: 'repeat', count: 5, children: ['move_forward'] }] }),
        },
        isActive: true,
    },
    {
        title: 'Conditional Castle',
        description: 'Use if-else statements to navigate through a magical castle.',
        category: 'conditionals',
        difficulty: 'Intermediate',
        topics: ['If Statements', 'Boolean Logic'],
        duration: 25,
        xpReward: 200,
        order: 3,
        prerequisites: [],
        content: {
            instructions: 'Conditionals let you make decisions in your code. Help the knight navigate the castle by checking if paths are clear before moving.',
            hints: [
                'Use the "If" block to check conditions',
                'The "Else" block runs when the condition is false',
                'You can check if a path is blocked or clear'
            ],
            solution: JSON.stringify({ blocks: [{ type: 'if', condition: 'path_clear', then: ['move_forward'], else: ['turn_right'] }] }),
        },
        isActive: true,
    },
    {
        title: 'Function Forest',
        description: 'Create reusable code blocks to solve forest puzzles.',
        category: 'functions',
        difficulty: 'Intermediate',
        topics: ['Function Creation', 'Parameters'],
        duration: 30,
        xpReward: 250,
        order: 4,
        prerequisites: [],
        content: {
            instructions: 'Functions are like recipes - you define them once and use them many times! Create a function to collect berries and call it multiple times.',
            hints: [
                'Define a function with a name like "collectBerry"',
                'Put the collection actions inside the function',
                'Call the function whenever you need to collect a berry'
            ],
            solution: JSON.stringify({ functions: [{ name: 'collectBerry', blocks: ['move_forward', 'pickup'] }], main: ['collectBerry', 'collectBerry', 'collectBerry'] }),
        },
        isActive: true,
    },
    {
        title: 'Array Arena',
        description: 'Battle with lists and arrays in this exciting challenge!',
        category: 'arrays',
        difficulty: 'Advanced',
        topics: ['Array Methods', 'Data Structures'],
        duration: 35,
        xpReward: 300,
        order: 5,
        prerequisites: [],
        content: {
            instructions: 'Arrays let you store multiple values in one place. Create an array of items and use loops to process each one.',
            hints: [
                'Create an array to store multiple items',
                'Use a loop to go through each item',
                'You can add, remove, or modify items in an array'
            ],
            solution: JSON.stringify({ code: 'const items = ["sword", "shield", "potion"]; items.forEach(item => collect(item));' }),
        },
        isActive: true,
    },
    {
        title: 'Object Odyssey',
        description: 'Explore the world of objects and their properties.',
        category: 'objects',
        difficulty: 'Advanced',
        topics: ['Object Properties', 'Methods'],
        duration: 40,
        xpReward: 350,
        order: 6,
        prerequisites: [],
        content: {
            instructions: 'Objects help you organize related data together. Create a character object with properties like name, health, and abilities.',
            hints: [
                'Objects use key-value pairs',
                'Access properties with dot notation',
                'Objects can have methods (functions) too'
            ],
            solution: JSON.stringify({ code: 'const hero = { name: "Alex", health: 100, attack: function() { return this.health > 0; } };' }),
        },
        isActive: true,
    },
];

const badges = [
    {
        name: 'First Steps',
        description: 'Complete your first mission!',
        icon: '🎯',
        category: 'mission_completion',
        rarity: 'Common',
        criteria: {
            type: 'complete_missions',
            value: 1,
        },
        xpReward: 50,
        order: 1,
        isActive: true,
    },
    {
        name: 'Mission Master',
        description: 'Complete 10 missions',
        icon: '🏆',
        category: 'mission_completion',
        rarity: 'Rare',
        criteria: {
            type: 'complete_missions',
            value: 10,
        },
        xpReward: 100,
        order: 2,
        isActive: true,
    },
    {
        name: 'XP Collector',
        description: 'Earn 1000 XP',
        icon: '⭐',
        category: 'xp_milestone',
        rarity: 'Rare',
        criteria: {
            type: 'earn_xp',
            value: 1000,
        },
        xpReward: 100,
        order: 3,
        isActive: true,
    },
    {
        name: 'Week Warrior',
        description: 'Maintain a 7-day coding streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'Epic',
        criteria: {
            type: 'maintain_streak',
            value: 7,
        },
        xpReward: 150,
        order: 4,
        isActive: true,
    },
    {
        name: 'Loop Legend',
        description: 'Master all loop missions',
        icon: '🔄',
        category: 'skill_mastery',
        rarity: 'Epic',
        criteria: {
            type: 'master_category',
            category: 'loops',
        },
        xpReward: 200,
        order: 5,
        isActive: true,
    },
    {
        name: 'Beginner Graduate',
        description: 'Complete all beginner missions',
        icon: '🎓',
        category: 'mission_completion',
        rarity: 'Rare',
        criteria: {
            type: 'complete_all_beginner',
        },
        xpReward: 150,
        order: 6,
        isActive: true,
    },
    {
        name: 'Code Champion',
        description: 'Complete all missions',
        icon: '👑',
        category: 'special_achievement',
        rarity: 'Legendary',
        criteria: {
            type: 'complete_missions',
            value: 100,
        },
        xpReward: 500,
        order: 7,
        isActive: true,
    },
];

async function seedDatabase() {
    try {
        // Connect to database
        await connectDB();

        logger.info('Starting database seed...');

        // Clear existing data
        await Mission.deleteMany({});
        await Badge.deleteMany({});
        logger.info('Cleared existing missions and badges');

        // Insert missions
        const createdMissions = await Mission.insertMany(missions);
        logger.info(`Created ${createdMissions.length} missions`);

        // Insert badges
        const createdBadges = await Badge.insertMany(badges);
        logger.info(`Created ${createdBadges.length} badges`);

        // Update all user stats with category totals
        const categoryCounts = {};
        createdMissions.forEach(mission => {
            categoryCounts[mission.category] = (categoryCounts[mission.category] || 0) + 1;
        });

        const updatePromises = Object.entries(categoryCounts).map(([category, count]) => {
            return UserStats.updateMany(
                {},
                { [`categoryProgress.${category}.total`]: count }
            );
        });

        await Promise.all(updatePromises);
        logger.info('Updated user stats with category totals');

        logger.info('✅ Database seeded successfully!');
        logger.info('\nSummary:');
        logger.info(`- Missions: ${createdMissions.length}`);
        logger.info(`- Badges: ${createdBadges.length}`);
        logger.info(`- Categories: ${Object.keys(categoryCounts).join(', ')}`);

        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run seed
seedDatabase();
