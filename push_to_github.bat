@echo off
cd /d "%~dp0"
echo ========================================================
echo   Pushing Diya Sarah James Web App to GitHub:
echo   https://github.com/Gouriop/DIYAMOL.git
echo ========================================================
echo.

git add .
git commit -m "Deploy Diya Sarah James Portfolio Web App" 2>nul

echo Pushing to GitHub main branch...
git push -u origin main --force
if %ERRORLEVEL% NEQ 0 (
    if exist "%LOCALAPPDATA%\MinGit\cmd\git.exe" (
        "%LOCALAPPDATA%\MinGit\cmd\git.exe" push -u origin main --force
    )
)

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo Vercel will now automatically deploy your live website!
    echo ========================================================
) else (
    echo.
    echo [NOTE] If prompted for Username, type: Gouriop
    echo [NOTE] If prompted for Password, use a GitHub Personal Access Token (PAT).
    echo Or you can upload the files directly on github.com.
)
echo.
pause
