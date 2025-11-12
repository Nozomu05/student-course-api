const s = require('../services/storage');

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Récupère la liste des étudiants
 *     description: Obtient une liste paginée d'étudiants avec filtres optionnels
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtre par nom (recherche partielle)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtre par email (recherche partielle)
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
 *         description: Nombre d'étudiants par page
 *     responses:
 *       200:
 *         description: Liste des étudiants récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 total:
 *                   type: integer
 *                   description: Nombre total d'étudiants
 */
exports.listStudents = (req, res) => {
  let students = s.list('students');
  const { name, email, page = 1, limit = 10 } = req.query;
  if (name) {
    students = students.filter(st => st.name.includes(name));
  }
  if (email) {
    students = students.filter(st => st.email.includes(email));
  }
  const start = (page - 1) * limit;
  const paginated = students.slice(start, start + Number(limit));
  res.json({ students: paginated, total: students.length });
};

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Récupère un étudiant par son ID
 *     description: Obtient les détails d'un étudiant et ses cours inscrits
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique de l'étudiant
 *     responses:
 *       200:
 *         description: Étudiant trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       404:
 *         description: Étudiant non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getStudent = (a, b) => {
  const c = s.get('students', a.params.id);
  if (!c) {
    return b.status(404).json({ error: 'Student not found' });
  }
  const courses = s.getStudentCourses(a.params.id);
  return b.json({ student: c, courses });
};

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Crée un nouvel étudiant
 *     description: Ajoute un nouvel étudiant au système
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom complet de l'étudiant
 *                 example: "Marie Martin"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique
 *                 example: "marie.martin@example.com"
 *     responses:
 *       201:
 *         description: Étudiant créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Données manquantes ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.createStudent = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }
  const result = s.create('students', { name, email });
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(201).json(result);
};

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Supprime un étudiant
 *     description: Supprime définitivement un étudiant du système
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant à supprimer
 *     responses:
 *       204:
 *         description: Étudiant supprimé avec succès
 *       404:
 *         description: Étudiant non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.deleteStudent = (req, res) => {
  const result = s.remove('students', req.params.id);
  if (result === false) {
    return res.status(404).json({ error: 'Student not found' });
  }
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(204).send();
};

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Met à jour un étudiant
 *     description: Modifie les informations d'un étudiant existant
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'étudiant
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nouvelle adresse email
 *     responses:
 *       200:
 *         description: Étudiant mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Email déjà utilisé par un autre étudiant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Étudiant non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.updateStudent = (req, res) => {
  const student = s.get('students', req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const { name, email } = req.body;
  if (
    email &&
    s.list('students').find(st => st.email === email && st.id !== student.id)
  ) {
    return res.status(400).json({ error: 'Email must be unique' });
  }
  if (name) {
    student.name = name;
  }
  if (email) {
    student.email = email;
  }
  return res.json(student);
};
