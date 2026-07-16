import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server.js';
import User from '../models/User.model.js';
import { jest } from '@jest/globals';

let mongoServer;
jest.setTimeout(600000);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'testsecret123';
  process.env.JWT_REFRESH_SECRET = 'testsecret456';
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Integration Tests', () => {
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  };

  let userId;
  let accessToken;

  it('should signup successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    
    userId = res.body.data.user._id;
    accessToken = res.body.data.tokens.accessToken;
  });

  it('should reject duplicate email on signup', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Email already registered/i);
  });

  it('should login successfully', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
      
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject unauthenticated access', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('should reject cross-user authorization (getUserById)', async () => {
    // Register user 1
    const res1 = await request(app).post('/api/v1/auth/register').send(testUser);
    const user1Token = res1.body.data.tokens.accessToken;
    
    // Register user 2
    const res2 = await request(app).post('/api/v1/auth/register').send({
      ...testUser,
      email: 'jane@example.com'
    });
    const user2Id = res2.body.data.user._id;
    
    // User 1 tries to access User 2's profile
    const res3 = await request(app)
      .get(`/api/v1/users/${user2Id}`)
      .set('Authorization', `Bearer ${user1Token}`);
      
    // The now-fixed cross-user authorization test should return 403
    expect(res3.status).toBe(403);
  });
});
