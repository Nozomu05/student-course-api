const express = require('express');

const {
  listCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse
} = require('../controllers/coursesController');

const router = express.Router();

router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', createCourse);
router.delete('/:id', deleteCourse);

/**
 * @swagger
 * /courses/{courseId}/students/{studentId}:
 *   post:
 *     summary: Inscrire un étudiant à un cours
 *     description: Ajoute un étudiant à la liste des participants d'un cours (maximum 3 étudiants par cours)
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cours
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant
 *     responses:
 *       201:
 *         description: Étudiant inscrit avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Inscription impossible (cours complet, déjà inscrit, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:courseId/students/:studentId', (req, res) => {
  const result = require('../services/storage').enroll(
    req.params.studentId,
    req.params.courseId
  );
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(201).json({ success: true });
});

/**
 * @swagger
 * /courses/{courseId}/students/{studentId}:
 *   delete:
 *     summary: Désinscrire un étudiant d'un cours
 *     description: Retire un étudiant de la liste des participants d'un cours
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cours
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant
 *     responses:
 *       204:
 *         description: Étudiant désinscrit avec succès
 *       400:
 *         description: Désinscription impossible (étudiant non inscrit, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:courseId/students/:studentId', (req, res) => {
  const result = require('../services/storage').unenroll(
    req.params.studentId,
    req.params.courseId
  );
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(204).send();
});

router.put('/:id', updateCourse);

module.exports = router;
