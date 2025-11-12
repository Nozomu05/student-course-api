module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Student Course API',
    version: '1.0.0',
    description:
      'API RESTful pour la gestion d\'étudiants et de cours avec système d\'inscription',
    contact: {
      name: 'API Support',
      email: 'support@studentapi.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur de développement'
    }
  ],
  tags: [
    {
      name: 'Students',
      description: 'Gestion des étudiants'
    },
    {
      name: 'Courses',
      description: 'Gestion des cours'
    },
    {
      name: 'Enrollments',
      description: 'Inscription et désinscription aux cours'
    }
  ],
  components: {
    schemas: {
      Student: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identifiant unique de l\'étudiant'
          },
          name: {
            type: 'string',
            description: 'Nom complet de l\'étudiant',
            example: 'Alice Dupont'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Adresse email unique de l\'étudiant',
            example: 'alice.dupont@example.com'
          }
        }
      },
      Course: {
        type: 'object',
        required: ['title', 'teacher'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identifiant unique du cours'
          },
          title: {
            type: 'string',
            description: 'Titre du cours',
            example: 'Mathématiques'
          },
          teacher: {
            type: 'string',
            description: 'Nom du professeur',
            example: 'M. Martin'
          }
        }
      },
      Enrollment: {
        type: 'object',
        properties: {
          studentId: {
            type: 'integer',
            description: 'ID de l\'étudiant inscrit'
          },
          courseId: {
            type: 'integer',
            description: 'ID du cours'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Message d\'erreur'
          }
        }
      }
    }
  }
};
