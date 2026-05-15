@echo off
cls
echo =============================================
echo          ML PROJECT GITHUB DEPLOYER         
echo =============================================
echo.

echo [1/4] Checking git status...
git status -s
echo.

echo [2/4] Staging all tracked changes...
git add .
echo.

set "commit_msg="
set /p commit_msg="Enter your commit message (no quotes needed): "
if "%commit_msg%"=="" set commit_msg=Initial fullstack setup

echo.
echo [3/4] Committing changes...
:: Robust double-quoting protects your string from Windows space splitting
git commit -m "%commit_msg%"
echo.

echo [4/4] Pushing code to GitHub...
:: Make sure a local main branch exists to match your remote destination target
git branch -M main
git push -u origin main

echo.
echo =============================================
echo       DEPLOYMENT COMPLETE! YOU ARE LIVE!     
echo =============================================
pause