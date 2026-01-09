# language: fr
Fonctionnalité: Mise à Jour de Tâche
  En tant qu'utilisateur
  Je veux modifier une tâche existante
  Afin de corriger ou compléter les informations

  Contexte:
    Étant donné l'application TodoManager est disponible

  Scénario: Mettre à jour le titre d'une tâche
    Étant donné une tâche existe avec titre "Ancien titre"
    Quand je mets à jour cette tâche avec:
      | titre | Nouveau titre |
    Alors la tâche est mise à jour avec succès
    Et le titre de la tâche est "Nouveau titre"
    Et le statut reste inchangé

  Scénario: Erreur - Titre vide lors de la mise à jour
    Étant donné une tâche existe
    Quand je tente de mettre à jour cette tâche avec:
      | titre | (vide) |
    Alors une erreur est retournée
    Et HTTP status 400 est reçu
