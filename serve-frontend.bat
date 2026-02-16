@echo off
cd /d "%~dp0frontend\dist"
npx http-server -p 3000 -c-1
pause