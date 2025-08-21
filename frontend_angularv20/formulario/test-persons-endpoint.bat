@echo off
echo Probando endpoint /persons...
echo.

echo 1. Probando GET /persons...
curl -s -w "HTTP Status: %%{http_code}\n" http://localhost:8000/api/persons
echo.
echo.

echo 2. Probando POST /persons...
curl -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"first_name\":\"Test\",\"last_name\":\"User\",\"birth_date\":\"1990-01-01\",\"age\":\"33\",\"profession\":\"Developer\",\"address\":\"Test Street\",\"phone\":\"3001234567\",\"email\":\"test@example.com\",\"photo_url\":\"\"}" ^
  http://localhost:8000/api/persons
echo.
echo.

echo Si ves error 500, verifica:
echo 1. Que Laravel esté ejecutándose
echo 2. Que la tabla 'persons' exista
echo 3. Que el controlador esté configurado para 'persons'
echo.
pause
