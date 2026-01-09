# language: fr
Fonctionnalité: Gestion du Statut de Tâche
  En tant qu'utilisateur
  Je veux changer le statut d'une tâche
  Afin de suivre la progression de mon travail

  Contexte:
    Étant donné l'application TodoManager est disponible

  Scénario: Transition PENDING → IN_PROGRESS
    Étant donné une tâche existe avec statut "PENDING"
    Quand je change le statut en "IN_PROGRESS"
    Alors le statut devient "IN_PROGRESS"

  Scénario: Transition IN_PROGRESS → DONE
    Étant donné une tâche existe avec statut "IN_PROGRESS"
    Quand je change le statut en "DONE"
    Alors le statut devient "DONE"

  Scénario: Transition inverse DONE → IN_PROGRESS
    Étant donné une tâche existe avec statut "DONE"
    Quand je change le statut en "IN_PROGRESS"
    Alors le statut devient "IN_PROGRESS"
