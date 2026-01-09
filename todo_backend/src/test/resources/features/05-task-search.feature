# language: fr
Fonctionnalité: Recherche et Consultation de Tâches
  En tant qu'utilisateur
  Je veux rechercher et consulter mes tâches
  Afin de retrouver facilement ce que je dois faire

  Contexte:
    Étant donné l'application TodoManager est disponible

  Scénario: Récupérer toutes les tâches
    Quand je demande la liste de toutes les tâches
    Alors je reçois une liste de tâches
    Et HTTP status 200 est reçu

  Scénario: Erreur - Tâche inexistante
    Quand je demande la tâche "999999"
    Alors une erreur "Tâche non trouvée" est retournée
    Et HTTP status 404 est reçu
