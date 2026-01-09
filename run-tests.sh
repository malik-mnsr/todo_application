#!/bin/bash

echo "======================================"
echo "🧪 EXÉCUTION DES TESTS CUCUMBER"
echo "======================================"
echo ""

# Vérifier que le backend est actif
echo "✓ Vérification du backend..."
if ! curl -s http://localhost:8080/tasks > /dev/null 2>&1; then
    echo ""
    echo "❌ ERREUR: Backend non actif!"
    echo ""
    echo "Pour démarrer le backend, ouvrez un NEW TERMINAL et exécutez:"
    echo "  cd /home/etudiant/todo_application/todo_backend"
    echo "  mvn spring-boot:run"
    echo ""
    echo "Ensuite, relancez ce script."
    exit 1
fi

echo "✓ Backend OK !"
echo ""

# Compiler
echo "📦 Compilation du projet..."
cd /home/etudiant/todo_application/todo_backend
mvn clean compile -q

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la compilation"
    exit 1
fi

echo "✓ Compilation OK"
echo ""

# Exécuter les tests
echo "🧪 Exécution des tests Cucumber..."
echo ""
mvn test -Dtest=TestRunner

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ TOUS LES TESTS RÉUSSIS!"
    echo ""
    echo "📊 Rapport disponible:"
    echo "   target/cucumber-reports/index.html"
else
    echo ""
    echo "❌ Certains tests ont échoué"
    echo ""
    echo "📊 Voir le rapport:"
    echo "   target/cucumber-reports/index.html"
fi
echo ""
echo "======================================"
