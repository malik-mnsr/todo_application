# language: fr
Fonctionnalité: Création de Tâche
  En tant qu'utilisateur
  Je veux créer une nouvelle tâche
  Afin de gérer ma liste de choses à faire

  Contexte:
    Étant donné l'application TodoManager est disponible

  Scénario: Créer une tâche avec titre et description
    Quand je crée une tâche avec:
      | titre       | Faire les courses    |
      | description | Lait, œufs, pain     |
    Alors la tâche est créée avec succès
    Et la tâche a le statut "PENDING"
    Et l'ID de la tâche est retourné

  Scénario: Erreur - Créer une tâche sans titre
    Quand je tente de créer une tâche avec:
      | titre | (vide) |
    Alors une erreur est retournée
    Et HTTP status 400 est reçu

  Scénario: Erreur - Titre trop court
    Quand je tente de créer une tâche avec:
      | titre | ab |
    Alors une erreur est retournée
    Et le message contient "entre 3 et 100"

  Scénario: Créer une tâche avec date d'échéance
    Quand je crée une tâche avec:
      | titre    | Tâche importante |
      | dueDate  | 2026-02-15       |
    Alors la tâche est créée avec succès
