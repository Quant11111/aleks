#!/bin/bash

# Script de démarrage pour le Portfolio Alexandra (Node.js)
echo "🚀 Démarrage du Portfolio Alexandra..."

PORT=3002

if command -v python3 &> /dev/null; then
    echo "✅ Démarrage sur le port $PORT..."
    echo "🔗 Ouvrez: http://localhost:$PORT"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✅ Démarrage sur le port $PORT..."
    echo "🔗 Ouvrez: http://localhost:$PORT"
    python -m SimpleHTTPServer $PORT
else
    echo "❌ Python requis"
    echo "Installez Python puis relancez"
    exit 1
fi 