const storage = require('../../src/services/storage');

beforeEach(() => {
  storage.reset();
  storage.seed();
});

test('should not allow duplicate course title', () => {
  const result = storage.create('courses', {
    title: 'Math',
    teacher: 'Someone'
  });
  expect(result.error).toBe('Course title must be unique');
});

test('should list seeded students', () => {
  const students = storage.list('students');
  expect(students.length).toBe(3);
  expect(students[0].name).toBe('Alice');
});

test('should create a new student', () => {
  const result = storage.create('students', {
    name: 'David',
    email: 'david@example.com'
  });
  expect(result.name).toBe('David');
  expect(storage.list('students').length).toBe(4);
});

test('should not allow duplicate student email', () => {
  const result = storage.create('students', {
    name: 'Eve',
    email: 'alice@example.com'
  });
  expect(result.error).toBe('Email must be unique');
});

test('should delete a student', () => {
  const students = storage.list('students');
  const result = storage.remove('students', students[0].id);
  expect(result).toBe(true);
});

test('should not allow more than 3 students in a course', () => {
  const students = storage.list('students');
  const course = storage.list('courses')[0];
  storage.create('students', { name: 'Extra', email: 'extra@example.com' });
  storage.create('students', { name: 'Extra2', email: 'extra2@example.com' });
  storage.enroll(students[0].id, course.id);
  storage.enroll(students[1].id, course.id);
  storage.enroll(students[2].id, course.id);
  const result = storage.enroll(4, course.id);
  expect(result.error).toBe('Course is full');
});

// Tests essentiels pour couverture ~80%
// Tests essentiels pour couverture juste au-dessus de 80%
test('should enroll student in course successfully', () => {
  const students = storage.list('students');
  const courses = storage.list('courses');
  const result = storage.enroll(students[0].id, courses[1].id);
  expect(result.success).toBe(true);
});

test('should not enroll non-existent student', () => {
  const courses = storage.list('courses');
  const result = storage.enroll(999, courses[0].id);
  expect(result.error).toBe('Student not found');
});

test('should get a specific student', () => {
  const students = storage.list('students');
  const student = storage.get('students', students[0].id);
  expect(student).toBeDefined();
  expect(student.name).toBe('Alice');
});

test('should not delete student enrolled in course', () => {
  const students = storage.list('students');
  const courses = storage.list('courses');
  storage.enroll(students[0].id, courses[0].id);
  const result = storage.remove('students', students[0].id);
  expect(result.error).toBe('Cannot delete student: enrolled in a course');
});

test('should return false when removing non-existent item', () => {
  const result = storage.remove('students', 999);
  expect(result).toBe(false);
});
