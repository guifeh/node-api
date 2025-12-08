import {test, expect} from 'vitest';
import supertest from 'supertest';
import {randomUUID} from 'node:crypto'
import { server } from '../app.ts';
import { faker } from '@faker-js/faker';
import { makeCourse } from '../tests/factories/make-course.ts';

test('get courses route', async () => {
    await server.ready();

    const titleId = randomUUID();

    const course = await makeCourse(titleId);
    
    const response = await supertest(server.server)
        .get(`/courses?search=${titleId}`)
        
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ 
        total: 1,
        courses: [
            {
                id: expect.any(String),
                title: titleId,
                enrollments: 0,
            }
        ],
    });
})