# language: fr
Fonctionnalité: Suppression de Tâche
  En tant qu'utilisateur
  Je veux supprimer une tâche
  Afin de nettoyer ma liste

  Contexte:
    Étant donné l'application TodoManager est disponible

  Scénario: Supprimer une tâche existante
    Étant donné une tâche existe
    Quand je supprime cette tâche
    Alors la tâche est supprimée avec succès
    Et HTTP status 204 est reçu

  Scénario: Erreur - Supprimer une tâche inexistante
    Quand je tente de supprimer la tâche "999999"
    Alors une erreur "Tâche non trouvée" est retournée
    Et HTTP status 404 est reçu
