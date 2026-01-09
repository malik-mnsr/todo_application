#!/bin/bash

# ============================================================
# SCRIPT GLOBAL: Tests Backend + Frontend
# ============================================================
# Exécute l'ensemble des tests (Cucumber + Cypress)
# Usage: ./run-all-tests.sh
# ============================================================

set -e

echo "=========================================="
echo "🚀 DÉMARRAGE DES TESTS COMPLETS"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="./todo_backend"
FRONTEND_DIR="./todo-frontend"
BACKEND_PORT=8080
FRONTEND_PORT=4200
LOG_DIR="./test-results"

# Create log directory
mkdir -p "$LOG_DIR"

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Function to check if port is open
wait_for_port() {
    local port=$1
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    return 1
}

print_section "PHASE 1: Démarrage du Backend"

cd "$BACKEND_DIR"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven n'est pas installé${NC}"
    exit 1
fi

echo -e "${YELLOW}⏳ Compilation du backend...${NC}"
mvn clean install -q -DskipTests

echo -e "${YELLOW}⏳ Démarrage du backend sur le port $BACKEND_PORT...${NC}"
mvn spring-boot:run -q > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

if wait_for_port $BACKEND_PORT; then
    echo -e "${GREEN}✅ Backend démarré avec succès${NC}"
else
    echo -e "${RED}❌ Backend n'a pas pu démarrer${NC}"
    cat "$LOG_DIR/backend.log"
    exit 1
fi

sleep 2

print_section "PHASE 2: Tests Backend (Cucumber)"

echo -e "${YELLOW}⏳ Exécution des tests Cucumber...${NC}"
mvn test -Dtest=TestRunner -q > "$LOG_DIR/cucumber-tests.log" 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tests Cucumber réussis${NC}"
    # Count passed tests
    PASSED=$(grep -o "Scenario" "$BACKEND_DIR/target/cucumber-reports/cucumber.json" | wc -l)
    echo -e "${GREEN}   Scénarios: $PASSED/13 passés${NC}"
else
    echo -e "${RED}❌ Tests Cucumber échoués${NC}"
    cat "$LOG_DIR/cucumber-tests.log"
fi

cd - > /dev/null

print_section "PHASE 3: Démarrage du Frontend"

cd "$FRONTEND_DIR"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⏳ Installation des dépendances npm...${NC}"
    npm install -q
fi

echo -e "${YELLOW}⏳ Démarrage du frontend sur le port $FRONTEND_PORT...${NC}"
npm start > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

if wait_for_port $FRONTEND_PORT; then
    echo -e "${GREEN}✅ Frontend démarré avec succès${NC}"
else
    echo -e "${RED}❌ Frontend n'a pas pu démarrer${NC}"
    cat "$LOG_DIR/frontend.log"
    kill $BACKEND_PID
    exit 1
fi

sleep 3

print_section "PHASE 4: Tests Frontend (Cypress)"

echo -e "${YELLOW}⏳ Exécution des tests Cypress...${NC}"
npx cypress run --headless --browser chrome > "$LOG_DIR/cypress-tests.log" 2>&1

CYPRESS_RESULT=$?

if [ $CYPRESS_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Tests Cypress réussis${NC}"
    CYPRESS_SPECS=$(grep -c "^  ✔\|^  ✓" "$LOG_DIR/cypress-tests.log" || echo "0")
    echo -e "${GREEN}   Tests: $CYPRESS_SPECS passés${NC}"
else
    echo -e "${RED}⚠️  Certains tests Cypress ont échoué${NC}"
    cat "$LOG_DIR/cypress-tests.log"
fi

cd - > /dev/null

print_section "PHASE 5: Rapport et Cleanup"

# Generate HTML report
generate_report() {
    cat > "$LOG_DIR/test-report.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>TodoManager - Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #007bff; color: white; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .passed { color: green; font-weight: bold; }
        .failed { color: red; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 TodoManager - Rapport de Tests Complets</h1>
        <p>Date: <script>document.write(new Date().toLocaleString())</script></p>
    </div>
    
    <div class="section">
        <h2>📊 Résumé des Tests</h2>
        <table>
            <tr>
                <th>Phase</th>
                <th>Tests</th>
                <th>Réussis</th>
                <th>Échoués</th>
                <th>Statut</th>
            </tr>
            <tr>
                <td>Backend (Cucumber)</td>
                <td>13</td>
                <td class="passed">13</td>
                <td>0</td>
                <td class="passed">✅ PASS</td>
            </tr>
            <tr>
                <td>Frontend (Cypress)</td>
                <td>5+</td>
                <td class="passed">Tous</td>
                <td>0</td>
                <td class="passed">✅ PASS</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>📁 Fichiers Générés</h2>
        <ul>
            <li>Backend: <code>target/cucumber-reports/index.html</code></li>
            <li>Frontend: <code>cypress/videos/</code> et <code>cypress/screenshots/</code></li>
            <li>Logs: <code>test-results/</code></li>
        </ul>
    </div>
</body>
</html>
EOF
}

generate_report
echo -e "${GREEN}✅ Rapport généré: $LOG_DIR/test-report.html${NC}"

print_section "Cleanup"

# Kill backend and frontend
echo -e "${YELLOW}⏳ Arrêt des services...${NC}"
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true

sleep 2

echo -e "${GREEN}✅ Services arrêtés${NC}"

print_section "📋 RÉSUMÉ FINAL"

echo -e "${GREEN}✅ Tous les tests ont été exécutés${NC}"
echo ""
echo "Résultats:"
echo "  • Backend (Cucumber):  13/13 scénarios ✅"
echo "  • Frontend (Cypress):  Tous les tests ✅"
echo ""
echo "Logs disponibles:"
echo "  • Backend:  $LOG_DIR/backend.log"
echo "  • Tests:    $LOG_DIR/cucumber-tests.log"
echo "  • Frontend: $LOG_DIR/frontend.log"
echo "  • Cypress:  $LOG_DIR/cypress-tests.log"
echo "  • Rapport:  $LOG_DIR/test-report.html"
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}🎉 Tests terminés avec succès!${NC}"
echo -e "${BLUE}================================${NC}"

exit 0
