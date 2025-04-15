import request from 'supertest';
import app from '../src/app';

describe('Auth Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
                role: 'staff',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered');
    });
});
