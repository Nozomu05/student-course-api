<!--
  Template de Pull Request (FR)
  - Utilisez ce template pour décrire clairement les changements et les validations.
  - Gardez la description concise mais complète (quoi, pourquoi, impact).
-->

# Titre

Résumé concis des changements (max 72 caractères recommandés).

## Description

Décrivez ce que fait cette PR et pourquoi elle est nécessaire. Incluez le contexte utile et les étapes conceptuelles.

- Type de changement : bugfix / feature / refactor / docs / tests / chore
- Issue liée : # (si applicable)

## Checklist Auteur

- [ ] La branche suit la convention de nommage (feature/..., fix/..., chore/...)
- [ ] Les tests unitaires/integration correspondants ont été ajoutés ou mis à jour
- [ ] Les tests passent localement (`npm test`)
- [ ] Le code est formaté (Prettier) et linté (ESLint)
- [ ] La couverture de code reste > 80% (`npm run test:coverage`)
- [ ] La documentation Swagger a été mise à jour si nécessaire
- [ ] Le pipeline CI/CD passe sans erreurs

## Comment tester / Scénarios manuels

1. Installer les dépendances : `npm install`
2. Lancer l'application (dev) : `npm start` ou `npm run dev`
3. Exécuter les tests : `npm test`
4. Accéder à la documentation Swagger : http://localhost:3000/api-docs
5. Étapes manuelles spécifiques à cette PR :
   - Ex : `POST /api/students` avec `{"name": "Test", "email": "test@test.com"}` → vérifier 201
   - Ex : `GET /api/students` → vérifier structure de réponse
   - Ex : `POST /api/courses/{courseId}/enroll` → vérifier logique d'inscription

Fournir des exemples de payloads, réponses attendues, et commandes curl/Postman.

## Impact

- Migration requise : oui / non
- Ralentissements/risques connus : décrire

## Checklist Relecteur·e

- [ ] Le scope de la PR est clair et limité
- [ ] Les changements sont testés ou expliqués
- [ ] Les risques de régression ont été évalués
- [ ] Les dépendances ajoutées sont nécessaires et sûres
- [ ] La documentation API (Swagger) est cohérente avec les changements
- [ ] Les performances ne sont pas dégradées (endpoints critiques)
- [ ] Le changelog / release notes doivent inclure ces changements (si applicable)

## Notes supplémentaires

Ajoutez toute information utile :
- Captures d'écran de l'interface Swagger (si endpoints modifiés)
- Logs d'erreur ou de performance
- Références de design ou spécifications
- Liens JIRA/GitHub Issues

---

**Commandes utiles pour le reviewer :**
```bash
npm install && npm test          # Tests complets
npm run test:coverage           # Vérifier couverture
npm start                       # Démarrer en mode dev
curl -X GET http://localhost:3000/api/students  # Test API rapide
```
