@echo off
echo 🧪 Probando API con campos en inglés
echo URL Base: http://localhost:8000/api
echo.

echo 1. Probando conexión básica...
curl -s -w "%%{http_code}" http://localhost:8000/api/test
echo.
echo.

echo 2. Probando GET /personas...
curl -s -w "%%{http_code}" http://localhost:8000/api/personas
echo.
echo.

echo 3. Probando POST /personas con campos en inglés...
curl -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"first_name\":\"John\",\"last_name\":\"Doe\",\"birth_date\":\"1990-01-01\",\"age\":\"33\",\"profession\":\"Engineer\",\"address\":\"123 Main Street\",\"phone\":\"3001234567\",\"photo_url\":\"\"}" ^
  http://localhost:8000/api/personas
echo.
echo.

echo 📋 Resumen de códigos HTTP esperados:
echo    GET /personas: 200
echo    POST /personas: 201 o 200
echo    GET /personas/{id}: 200
echo    PUT /personas/{id}: 200
echo    DELETE /personas/{id}: 204 o 200
echo.
echo 🔧 Si hay errores, verifica:
echo    1. Que Laravel esté ejecutándose en http://localhost:8000
echo    2. Que el endpoint /api/personas esté configurado
echo    3. Que CORS esté habilitado en Laravel
echo    4. Que los campos en inglés estén configurados en Laravel
echo.
pause
