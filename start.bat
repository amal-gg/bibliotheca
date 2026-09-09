@echo off
title Bibliotheca - Literature Explorer & Reader
cd /d "%~dp0"

echo ========================================================
echo   🏛️ Starting Bibliotheca - Literature Explorer
echo ========================================================

set "NODE_CMD=node"
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "NODE_CMD=C:\Program Files (x86)\nodejs\node.exe"
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_CMD=C:\Program Files\nodejs\node.exe"
    ) else (
        echo [ERROR] Node.js was not found!
        echo Please ensure Node.js is installed.
        pause
        exit /b 1
    )
)

echo Starting server on http://localhost:3000...
start "" http://localhost:3000

"%NODE_CMD%" server.mjs
pause
