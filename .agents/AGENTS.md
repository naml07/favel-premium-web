# RÈGLES DU PROJET (WORKSPACE RULES)

## AUTOMATION DÉPLOIEMENT GITHUB (WINDOWS BATCH SCRIPT)

À chaque fois que vous créez un nouveau projet web ou finalisez la structure d'un site pour le compte associé à `nayalik2006@gmail.com` :
1. **Création obligatoire du script de déploiement** : Vous devez automatiquement créer un fichier `deploy_github.bat` à la racine du dossier projet.
2. **Contenu standard du script (`deploy_github.bat`)** :
   ```batch
   @echo off
   chcp 65001 >nul
   echo ======================================================
   echo   DÉPLOIEMENT AUTOMATIQUE SUR GITHUB / CLOUDFLARE
   echo ======================================================
   echo.
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
   git push
   echo.
   echo SUCCÈS ! Modifications envoyées sur GitHub.
   pause
   ```
3. **Explication utilisateur** : Rappeler brièvement à l'utilisateur qu'il lui suffit de double-cliquer sur `deploy_github.bat` pour mettre en ligne son site sur GitHub et déclencher Cloudflare/Netlify en un clic.
