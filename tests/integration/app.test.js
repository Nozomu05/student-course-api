const request = require('supertest');
const app = require('../../src/app');

describe('Student-Course API integration', () => {
  beforeEach(() => {
    require('../../src/services/storage').reset();
    require('../../src/services/storage').seed();
  });

  test('GET /students should return seeded students', async() => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.students.length).toBe(3);
    expect(res.body.students[0].name).toBe('Alice');
  });

  test('POST /students should create a new student', async() => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'David', email: 'david@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('David');
  });

  test('POST /students should not allow duplicate email', async() => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'Eve', email: 'alice@example.com' });
    expect(res.statusCode).toBe(400);
  });

  test('DELETE /courses/:id should not delete a course if students are enrolled', async() => {
    const courses = await request(app).get('/courses');
    const courseId = courses.body.courses[0].id;
    await request(app).post(`/courses/${courseId}/students/1`);
    const res = await request(app).delete(`/courses/${courseId}`);
    expect(res.statusCode).toBe(400);
  });

  // Tests essentiels pour améliorer la couverture
  test('GET /students/:id should return student with courses', async() => {
    const res = await request(app).get('/students/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.student).toBeDefined();
    expect(res.body.courses).toBeDefined();
  });

  test('GET /students/:id should return 404 for non-existent student', async() => {
    const res = await request(app).get('/students/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Student not found');
  });

  test('GET /courses/:id should return course with students', async() => {
    const res = await request(app).get('/courses/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.course).toBeDefined();
    expect(res.body.students).toBeDefined();
  });

  test('POST /students should require name and email', async() => {
    const res = await request(app).post('/students').send({ name: 'Test' }); // missing email
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('name and email required');
  });

  test('POST /courses should create a new course', async() => {
    const res = await request(app)
      .post('/courses')
      .send({ title: 'New Course', teacher: 'New Teacher' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Course');
  });

  test('DELETE /students/:id should delete a student', async() => {
    // Create a student first
    const createRes = await request(app)
      .post('/students')
      .send({ name: 'ToDelete', email: 'delete@example.com' });
    const studentId = createRes.body.id;

    const res = await request(app).delete(`/students/${studentId}`);
    expect(res.statusCode).toBe(204);
  });

  test('PUT /students/:id should update a student', async() => {
    const res = await request(app)
      .put('/students/1')
      .send({ name: 'Updated Alice' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Alice');
  });

  test('PUT /students/:id should not allow duplicate email', async() => {
    const res = await request(app)
      .put('/students/1')
      .send({ email: 'bob@example.com' }); // Bob's email already exists
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email must be unique');
  });

  test('POST /courses/:courseId/students/:studentId should enroll student', async() => {
    const res = await request(app).post('/courses/2/students/3');
    expect(res.statusCode).toBe(201);
  });

  test('DELETE /courses/:courseId/students/:studentId should unenroll student', async() => {
    await request(app).post('/courses/2/students/2'); // First enroll
    const res = await request(app).delete('/courses/2/students/2');
    expect(res.statusCode).toBe(204);
  });

  // Tests pour améliorer couverture coursesController
  test('PUT /courses/:id should update a course', async() => {
    const res = await request(app)
      .put('/courses/1')
      .send({ title: 'Updated Math', teacher: 'Updated Teacher' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Math');
    expect(res.body.teacher).toBe('Updated Teacher');
  });

  test('PUT /courses/:id should return 404 for non-existent course', async() => {
    const res = await request(app).put('/courses/999').send({ title: 'Test' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Course not found');
  });

  test('PUT /courses/:id should not allow duplicate title', async() => {
    const res = await request(app).put('/courses/1').send({ title: 'Physics' }); // Physics already exists (course id 2)
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Course title must be unique');
  });

  test('POST /courses should not allow duplicate title', async() => {
    const res = await request(app)
      .post('/courses')
      .send({ title: 'Math', teacher: 'Someone' }); // Math already exists
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Course title must be unique');
  });
});
