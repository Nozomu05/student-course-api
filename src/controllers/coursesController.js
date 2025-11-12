const storage = require('../services/storage');

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Récupère la liste des cours
 *     description: Obtient une liste paginée de cours avec filtres optionnels
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filtre par titre (recherche partielle)
 *       - in: query
 *         name: teacher
 *         schema:
 *           type: string
 *         description: Filtre par nom du professeur (recherche partielle)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de cours par page
 *     responses:
 *       200:
 *         description: Liste des cours récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 total:
 *                   type: integer
 *                   description: Nombre total de cours
 */
exports.listCourses = (req, res) => {
  let courses = storage.list('courses');
  const { title, teacher, page = 1, limit = 10 } = req.query;
  if (title) {
    courses = courses.filter(c => c.title.includes(title));
  }
  if (teacher) {
    courses = courses.filter(c => c.teacher.includes(teacher));
  }
  const start = (page - 1) * limit;
  const paginated = courses.slice(start, start + Number(limit));
  res.json({ courses: paginated, total: courses.length });
};

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Récupère un cours par son ID
 *     description: Obtient les détails d'un cours et la liste des étudiants inscrits
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique du cours
 *     responses:
 *       200:
 *         description: Cours trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       404:
 *         description: Cours non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getCourse = (req, res) => {
  const course = storage.get('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const students = storage.getCourseStudents(req.params.id);
  return res.json({ course, students });
};

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Crée un nouveau cours
 *     description: Ajoute un nouveau cours au système
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - teacher
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du cours
 *                 example: "Physique"
 *               teacher:
 *                 type: string
 *                 description: Nom du professeur
 *                 example: "Mme. Durand"
 *     responses:
 *       201:
 *         description: Cours créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Données manquantes ou cours déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.createCourse = (req, res) => {
  const { title, teacher } = req.body;
  if (!title || !teacher) {
    return res.status(400).json({ error: 'title and teacher required' });
  }
  const created = storage.create('courses', { title, teacher });
  if (created.error) {
    return res.status(400).json({ error: created.error });
  }
  return res.status(201).json(created);
};

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Supprimer un cours
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé
 *       404:
 *         description: Non trouvé
 */
exports.deleteCourse = (req, res) => {
  const result = storage.remove('courses', req.params.id);
  if (result === false) {
    return res.status(404).json({ error: 'Course not found' });
  }
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(204).send();
};

exports.updateCourse = (req, res) => {
  const course = storage.get('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const { title, teacher } = req.body;
  if (
    title &&
    storage.list('courses').find(c => c.title === title && c.id !== course.id)
  ) {
    return res.status(400).json({ error: 'Course title must be unique' });
  }
  if (title) {
    course.title = title;
  }
  if (teacher) {
    course.teacher = teacher;
  }
  return res.json(course);
};
