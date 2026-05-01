#!/bin/bash

# Script para verificar configuración de Firebase
# Uso: bash verify-firebase.sh

echo "🔍 Verificando configuración de Firebase..."
echo ""

# Verificar si .env.local existe
if [ ! -f ".env.local" ]; then
    echo "❌ Archivo .env.local no encontrado"
    echo "📋 Por favor crea el archivo .env.local basado en .env.local.example"
    echo ""
    echo "Pasos:"
    echo "1. Copia .env.local.example → .env.local"
    echo "2. Reemplaza los valores con tus credenciales de Firebase"
    echo "3. Ejecuta: bash verify-firebase.sh"
    exit 1
fi

echo "✅ Archivo .env.local encontrado"
echo ""

# Verificar que contenga todas las variables
REQUIRED_VARS=(
    "EXPO_PUBLIC_FIREBASE_API_KEY"
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID"
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    "EXPO_PUBLIC_FIREBASE_APP_ID"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "$var" .env.local; then
        echo "✅ $var"
    else
        echo "❌ $var"
        MISSING_VARS+=("$var")
    fi
done

echo ""

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "🎉 ¡Todas las variables están configuradas!"
    echo ""
    echo "Próximos pasos:"
    echo "1. npm install (si aún no lo hiciste)"
    echo "2. npm start"
    echo "3. Abre la app y prueba registro/login"
else
    echo "❌ Faltan variables por configurar:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
fi
