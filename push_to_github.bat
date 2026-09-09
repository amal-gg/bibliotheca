@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   Bibliotheca - 1-Click GitHub Repository Uploader
echo ============================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/bibliotheca.git): "
if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Exiting...
    pause
    exit /b 1
)

echo.
echo Setting remote repository...
".git-bin\cmd\git.exe" remote remove origin 2>nul
".git-bin\cmd\git.exe" remote add origin %REPO_URL%

echo.
echo Pushing code to branch 'main'...
".git-bin\cmd\git.exe" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ============================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo Next step: Go to https://render.com - New + - Web Service
    echo Select your repository and Render will deploy it automatically!
    echo ============================================================
) else (
    echo.
    echo [NOTE] If you were prompted for credentials:
    echo For GitHub password, use a Personal Access Token (PAT) from:
    echo https://github.com/settings/tokens
)

echo.
pause
