@echo off
echo ========================================
echo Secure Vault - Installation Script
echo ========================================
echo.

echo Installing dependencies...
call npm install

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Next steps:
echo 1. Set up Supabase (see SETUP.md)
echo 2. Configure src/lib/supabase.ts with your credentials
echo 3. Run 'npm start' to start the development server
echo.
pause
