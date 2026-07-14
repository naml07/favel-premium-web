@echo off
chcp 65001 >nul
echo ======================================================
echo   DÉPLOIEMENT AUTOMATIQUE SUR GITHUB / CLOUDFLARE
echo ======================================================
echo.

:: Initialisation du dépôt si ce n'est pas déjà fait
if not exist ".git" (
    echo [0/4] Initialisation du dépôt Git local...
    git init
    git branch -M main
    git remote add origin https://github.com/naml07/favel-premium-web.git
)

echo [1/4] Configuration de l'identité Git...
git config user.email "nayalik2006@gmail.com"
git config user.name "Nayalik"

echo [2/4] Ajout des fichiers modifiés...
git add .

echo [3/4] Création de la validation...
set /p commit_msg="Entrez un message de modification (ou Entree pour défaut) : "
if "%commit_msg%"=="" set commit_msg=update: mise à jour automatique
git commit -m "%commit_msg%"

echo [4/4] Envoi vers GitHub...
git push -u origin main

echo.
echo SUCCÈS ! Modifications envoyées sur GitHub.
pause
