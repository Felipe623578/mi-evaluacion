@echo off
echo Probando POST /api/personas...
echo.

curl -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"first_name\":\"John\",\"last_name\":\"Doe\",\"birth_date\":\"1990-01-01\",\"age\":\"33\",\"profession\":\"Engineer\",\"address\":\"123 Main Street\",\"phone\":\"3001234567\",\"photo_url\":\"\"}" ^
  http://localhost:8000/api/personas

echo.
echo.
pause
