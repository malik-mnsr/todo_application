# 📝 TodoManager - Application de Gestion de Tâches

Une application web complète pour gérer efficacement votre liste de tâches avec une interface moderne et intuitive.

## 🎯 Objectif

TodoManager permet aux utilisateurs de **créer, consulter, modifier, finaliser et supprimer** des tâches de manière simple et efficace. L'application propose une expérience utilisateur fluide avec validation en temps réel et gestion d'erreurs complète.

## ✨ Fonctionnalités

### 6 Services Principaux

| # | Fonctionnalité | Description |
|---|---|---|
| 1️⃣ | **Création de tâche** | Créer une nouvelle tâche avec titre obligatoire, statut initial PENDING |
| 2️⃣ | **Consultation liste** | Afficher toutes les tâches existantes |
| 3️⃣ | **Consultation unitaire** | Récupérer les informations d'une tâche spécifique |
| 4️⃣ | **Mise à jour** | Modifier titre, description ou date d'échéance (statut inchangé) |
| 5️⃣ | **Finalisation** | Marquer une tâche comme terminée (DONE) |
| 6️⃣ | **Suppression** | Supprimer une tâche du système |

### Fonctionnalités Additionnelles

- ✅ **Recherche par titre** - Filtrer les tâches en temps réel
- ✅ **Progression du statut** - À faire → En cours → Terminé
- ✅ **Annulation du statut** - Revenir en arrière dans la progression
- ✅ **Validation en temps réel** - Compteur de caractères et messages d'erreur
- ✅ **Gestion des erreurs** - Messages clairs et informatifs
- ✅ **Responsive Design** - Fonctionne sur tous les appareils
- ✅ **Interface moderne** - Design épuré avec gradient et animations

## 🏗️ Architecture

### Structure du Projet

```
todo_application/
├── todo_backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/example/
│   │       ├── controller/       # REST Controllers
│   │       ├── service/          # Business Logic
│   │       ├── repository/       # Data Access Layer
│   │       ├── model/            # JPA Entities
│   │       ├── dto/              # Data Transfer Objects
│   │       ├── exception/        # Custom Exceptions
│   │       ├── handler/          # Global Exception Handler
│   │       └── response/         # Response Models
│   └── pom.xml                   # Maven Dependencies
│
└── todo-frontend/                # Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── task-list/      # Affichage des tâches
    │   │   │   ├── task-form/      # Création de tâche
    │   │   │   └── task-edit/      # Modification de tâche
    │   │   ├── services/
    │   │   │   └── task.service.ts # API Communication
    │   │   └── models/
    │   │       └── task.model.ts   # TypeScript Models
    │   └── styles.scss             # Global Styles
    └── package.json                # NPM Dependencies
```

## 🚀 Installation et Démarrage

### Prérequis

- **Java 11+** pour le backend
- **Node.js 16+** et **npm** pour le frontend
- **Maven** pour construire le backend
- **Git** (optionnel)

### Backend (Spring Boot)

#### 1. Accéder au répertoire backend
```bash
cd /home/etudiant/Téléchargements/todo
```

#### 2. Construire le projet
```bash
mvn clean install
```

#### 3. Démarrer l'application
```bash
mvn spring-boot:run
```

Le backend s'exécutera sur **http://localhost:8080**

### Frontend (Angular)

#### 1. Accéder au répertoire frontend
```bash
cd /home/etudiant/front/todo-frontend
```

#### 2. Installer les dépendances
```bash
npm install
```

#### 3. Démarrer le serveur de développement
```bash
npm start
```

Le frontend s'exécutera sur **http://localhost:4200**

> **Note**: Si le port 4200 est déjà utilisé, Angular demandera d'utiliser un port différent.

## 📊 Attributs de Tâche

Une tâche est composée des attributs suivants:

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|------------|
| **id** | Long | ✅ | Identifiant unique |
| **titre** | String | ✅ | Titre de la tâche (3-100 caractères) |
| **description** | String | ❌ | Description détaillée (max 500 caractères) |
| **dueDate** | LocalDate | ❌ | Date d'échéance (futur uniquement) |
| **status** | TaskStatus | ✅ | PENDING, IN_PROGRESS, DONE |
| **createdAt** | LocalDateTime | ✅ | Date de création (auto) |
| **updatedAt** | LocalDateTime | ✅ | Date de dernière modification (auto) |

## 🔄 Statuts de Tâche

### Progression Forward
```
PENDING (À faire)
    ↓
IN_PROGRESS (En cours)
    ↓
DONE (Terminé)
```

### Progression Backward (Annulation)
```
DONE (Terminé)
    ↓
IN_PROGRESS (En cours)
    ↓
PENDING (À faire)
```

## 🛡️ Gestion des Erreurs

L'application gère les erreurs suivantes:

### Validation Frontend
- ✅ Titre vide → "Le titre est obligatoire"
- ✅ Titre < 3 caractères → "Le titre doit contenir au moins 3 caractères"
- ✅ Titre > 100 caractères → "Le titre ne peut pas dépasser 100 caractères"
- ✅ Description > 500 caractères → "La description ne peut pas dépasser 500 caractères"
- ✅ Date antérieure → "La date d'échéance doit être dans le futur"

### Validation Backend
- ✅ Tâche non trouvée → HTTP 404 (TASK_NOT_FOUND)
- ✅ Titre invalide → HTTP 400 (INVALID_TASK)
- ✅ Erreur serveur → HTTP 500 (INTERNAL_SERVER_ERROR)

## 🔌 API REST

### Endpoints Disponibles

#### Tâches
| Méthode | Endpoint | Description |
|---------|----------|------------|
| `GET` | `/tasks` | Récupérer toutes les tâches |
| `GET` | `/tasks/{id}` | Récupérer une tâche par ID |
| `POST` | `/tasks` | Créer une nouvelle tâche |
| `PUT` | `/tasks/{id}` | Mettre à jour une tâche |
| `PATCH` | `/tasks/{id}/status` | Changer le statut d'une tâche |
| `DELETE` | `/tasks/{id}` | Supprimer une tâche |
| `GET` | `/tasks/search?keyword={keyword}` | Rechercher des tâches |
| `GET` | `/tasks/status/{status}` | Filtrer par statut |
| `GET` | `/tasks/sorted/due-date` | Tâches triées par date d'échéance |

### Exemples de Requêtes

#### Créer une tâche
```bash
curl -X POST http://localhost:8080/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Faire les courses",
    "description": "Acheter du lait, œufs, pain",
    "dueDate": "2026-01-15"
  }'
```

#### Récupérer toutes les tâches
```bash
curl -X GET http://localhost:8080/tasks
```

#### Mettre à jour une tâche
```bash
curl -X PUT http://localhost:8080/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Faire les courses (modifié)",
    "description": "Acheter du lait, œufs, pain, fromage"
  }'
```

#### Changer le statut
```bash
curl -X PATCH "http://localhost:8080/tasks/1/status?status=IN_PROGRESS"
```

#### Supprimer une tâche
```bash
curl -X DELETE http://localhost:8080/tasks/1
```

## 🎨 Interface Utilisateur

### Header
- 🎯 Titre "✨ My Tasks"
- ➕ Bouton pour créer une nouvelle tâche

### Barre de Recherche
- 🔍 Champ de recherche en temps réel
- 🔄 Bouton de rafraîchissement

### Grille des Tâches
- 📋 **2 tâches par ligne** (responsive)
- **Carte individuelle par tâche** avec:
  - Titre et statut (badge coloré)
  - Description
  - Dates de création et d'échéance
  - **4 boutons d'action:**
    1. 🟢 **Démarrer/Terminer** - Progression du statut
    2. 🔵 **Retour/Annuler** - Annulation du statut
    3. 🟠 **Modifier** - Éditer la tâche
    4. 🔴 **Supprimer** - Supprimer avec confirmation

### Couleurs des Statuts
| Statut | Couleur | Label |
|--------|---------|-------|
| PENDING | 🟡 Jaune | À faire |
| IN_PROGRESS | 🔵 Bleu | En cours |
| DONE | 🟢 Vert | Terminé |

## 🔧 Configuration

### Backend (application.properties)
```properties
server.port=8080
spring.web.cors.allowed-origins=http://localhost:4200
spring.jpa.hibernate.ddl-auto=create
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

### Frontend (task.service.ts)
```typescript
private apiUrl = 'http://localhost:8080/tasks';
```

## 📦 Dépendances

### Backend
- **Spring Boot 3.x** - Framework web
- **Spring Data JPA** - ORM
- **H2 Database** - Base de données en mémoire
- **Lombok** - Génération de code
- **Hibernate Validator** - Validation

### Frontend
- **Angular 19** - Framework web
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive
- **Bootstrap/SCSS** - Styles

## 🧪 Tests

### Tester la Création
1. Cliquez sur **"+ Nouvelle tâche"**
2. Entrez un titre (3-100 caractères)
3. Optionnel: Ajoutez une description
4. Optionnel: Sélectionnez une date d'échéance
5. Cliquez **"Créer la tâche"**

### Tester la Modification
1. Cliquez sur le bouton **"Modifier"** d'une tâche
2. Modifiez le titre ou la description
3. Cliquez **"Mettre à jour"**

### Tester la Progression du Statut
1. Tâche en "À faire" → Cliquez **"Démarrer"** → Devient "En cours"
2. Tâche en "En cours" → Cliquez **"Terminer"** → Devient "Terminé"
3. Tâche en "Terminé" → Cliquez **"Annuler"** → Revient "En cours"

### Tester la Suppression
1. Cliquez sur le bouton **"Supprimer"**
2. Confirmez la suppression
3. La tâche est supprimée de la liste

## 📋 Checklist de Complétude

- ✅ 1️⃣ Création de tâche
- ✅ 2️⃣ Consultation liste des tâches
- ✅ 3️⃣ Consultation d'une tâche
- ✅ 4️⃣ Mise à jour d'une tâche
- ✅ 5️⃣ Finalisation d'une tâche
- ✅ 6️⃣ Suppression d'une tâche
- ✅ Gestion complète des erreurs
- ✅ Validation en temps réel
- ✅ Interface responsive
- ✅ Recherche fonctionnelle
- ✅ Progression du statut avant/arrière

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifiez si le port 8080 est libre
lsof -i :8080

# Si occupé, changez le port dans application.properties
server.port=8081
```

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend est en cours d'exécution
- Vérifiez l'URL dans `task.service.ts`
- Vérifiez la configuration CORS du backend

### Les tâches ne s'affichent pas
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs dans l'onglet "Network"
- Vérifiez que le backend retourne les tâches avec `GET /tasks`

## 👨‍💻 Développement

### Structure du Code

**Backend** - Architecture en couches:
- **Controller** - Points d'entrée REST
- **Service** - Logique métier
- **Repository** - Accès aux données
- **Model** - Entités JPA
- **DTO** - Objet de transfert de données
- **Exception** - Exceptions personnalisées
- **Handler** - Gestion globale des erreurs

**Frontend** - Architecture modulaire:
- **Components** - Composants réutilisables
- **Services** - Communication avec API
- **Models** - Interfaces TypeScript
- **Styles** - Feuilles de style SCSS

## 📝 Licence

Ce projet est créé à titre d'exemple éducatif.

## 👥 Auteur

Développé avec ❤️ pour démontrer une application web complète.

---

**Version**: 1.0.0  
**Dernière mise à jour**: Janvier 2026

Pour plus d'informations ou pour signaler un bug, veuillez consulter les logs du serveur.
