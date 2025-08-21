@echo off
echo Verificando rutas de Laravel...
echo.

echo 1. Probando endpoint que funciona...
curl -s -w "HTTP Status: %%{http_code}\n" http://localhost:8000/api/test
echo.
echo.

echo 2. Probando endpoint persons (debería dar 404)...
curl -s -w "HTTP Status: %%{http_code}\n" http://localhost:8000/api/persons
echo.
echo.

echo 3. Probando endpoint personas (por si acaso)...
curl -s -w "HTTP Status: %%{http_code}\n" http://localhost:8000/api/personas
echo.
echo.

echo Si todos dan 404 excepto /test, necesitas configurar las rutas en Laravel
echo.
pause
