import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mission from '../models/Mission.model.js';
import Badge from '../models/Badge.model.js';
import User from '../models/User.model.js';
import Stats from '../models/Stats.model.js';
import connectDB from '../config/database.js';
import logger from './logger.js';

dotenv.config();

const missions = [
  {
    title: 'Apples Variable Assignment',
    description: 'Create a variable called apples and assign it the number 5!',
    difficulty: 'Easy',
    category: 'variables',
    topics: ['Variables', 'Assignment'],
    duration: 10,
    xpReward: 50,
    order: 1,
    codeTemplate: `// Create a variable called apples and assign it 5
function getApples() {
  // Your code here
  
}`,
    testCases: [
      { input: [], expected: 5, functionName: 'getApples' },
    ],
  },
  {
    title: 'Greeting Generator',
    description: 'Write a function that returns "Hello, BitBuds!"',
    difficulty: 'Easy',
    category: 'strings',
    topics: ['Strings', 'Return Values'],
    duration: 10,
    xpReward: 50,
    order: 2,
    codeTemplate: `function greet() {
  // Return the greeting string
  
}`,
    testCases: [
      { input: [], expected: 'Hello, BitBuds!', functionName: 'greet' },
    ],
  },
  {
    title: 'Add Two Numbers',
    description: 'Create a function that adds two numbers together.',
    difficulty: 'Easy',
    category: 'math',
    topics: ['Functions', 'Arithmetic'],
    duration: 15,
    xpReward: 50,
    order: 3,
    codeTemplate: `function add(a, b) {
  // Return the sum of a and b
  
}`,
    testCases: [
      { input: [2, 3], expected: 5, functionName: 'add' },
      { input: [10, 20], expected: 30, functionName: 'add' },
      { input: [-1, 1], expected: 0, functionName: 'add' },
    ],
  },
  {
    title: 'Double It Loop',
    description: 'Double each number in an array using a loop.',
    difficulty: 'Medium',
    category: 'loops',
    topics: ['For Loops', 'Arrays'],
    duration: 20,
    xpReward: 75,
    order: 4,
    codeTemplate: `function doubleNumbers(numbers) {
  const result = [];
  // Loop through numbers and push doubled values
  
  return result;
}`,
    testCases: [
      { input: [[1, 2, 3]], expected: [2, 4, 6], functionName: 'doubleNumbers' },
      { input: [[0, 5]], expected: [0, 10], functionName: 'doubleNumbers' },
    ],
  },
  {
    title: 'Is Even Checker',
    description: 'Write a function that returns true if a number is even.',
    difficulty: 'Medium',
    category: 'conditionals',
    topics: ['If Statements', 'Modulo'],
    duration: 15,
    xpReward: 75,
    order: 5,
    codeTemplate: `function isEven(n) {
  // Return true if n is even, false otherwise
  
}`,
    testCases: [
      { input: [4], expected: true, functionName: 'isEven' },
      { input: [7], expected: false, functionName: 'isEven' },
      { input: [0], expected: true, functionName: 'isEven' },
    ],
  },
  {
    title: 'Find the Maximum',
    description: 'Find the largest number in an array.',
    difficulty: 'Hard',
    category: 'arrays',
    topics: ['Arrays', 'Comparison'],
    duration: 25,
    xpReward: 100,
    order: 6,
    codeTemplate: `function findMax(numbers) {
  // Return the largest number in the array
  
}`,
    testCases: [
      { input: [[3, 9, 1, 7]], expected: 9, functionName: 'findMax' },
      { input: [[-5, -1, -10]], expected: -1, functionName: 'findMax' },
      { input: [[42]], expected: 42, functionName: 'findMax' },
    ],
  },
];

const badges = [
  {
    name: 'Variable Master',
    description: 'Complete your first coding mission!',
    emoji: '🎯',
    criteriaType: 'missions',
    criteriaValue: 1,
    category: 'mission_completion',
    rarity: 'Common',
    xpReward: 25,
  },
  {
    name: 'Mission Explorer',
    description: 'Complete 3 missions',
    emoji: '🚀',
    criteriaType: 'missions',
    criteriaValue: 3,
    category: 'mission_completion',
    rarity: 'Rare',
    xpReward: 50,
  },
  {
    name: 'XP Champion',
    description: 'Earn 200 XP',
    emoji: '⭐',
    criteriaType: 'xp',
    criteriaValue: 200,
    category: 'xp_milestone',
    rarity: 'Rare',
    xpReward: 50,
  },
  {
    name: 'Streak Hunter',
    description: 'Maintain a 3-day coding streak',
    emoji: '🔥',
    criteriaType: 'streak',
    criteriaValue: 3,
    category: 'streak',
    rarity: 'Epic',
    xpReward: 75,
  },
];

const demoUser = {
  firstName: 'Demo',
  lastName: 'Explorer',
  email: 'demo@bitbuds.app',
  password: 'BitBuds2026!',
  role: 'user',
  level: 3,
  xp: 275,
  coins: 120,
};

const seed = async () => {
  try {
    await connectDB();

    const existingDemoUser = await User.findOne({ email: demoUser.email });
    if (existingDemoUser) {
      await Promise.all([
        Stats.deleteOne({ userId: existingDemoUser._id }),
        User.deleteOne({ _id: existingDemoUser._id }),
      ]);
    }

    await Promise.all([Mission.deleteMany({}), Badge.deleteMany({})]);

    const createdMissions = await Mission.insertMany(missions);
    const createdBadges = await Badge.insertMany(badges);

    const user = await User.create(demoUser);

    await Stats.create({
      userId: user._id,
      level: demoUser.level,
      totalXP: demoUser.xp,
      missionsCompleted: 3,
      completedMissions: createdMissions.slice(0, 3).map((mission) => mission._id),
      categoryProgress: {
        variables: { completed: 1, total: 1 },
        strings: { completed: 1, total: 1 },
        math: { completed: 1, total: 1 },
      },
      activityLog: [
        { type: 'mission', message: 'Completed the demo onboarding missions', xpEarned: demoUser.xp },
      ],
    });

    logger.info('Database seeded successfully', {
      missions: createdMissions.length,
      badges: createdBadges.length,
      demoUser: demoUser.email,
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    logger.error('Seed failed', { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

seed();
