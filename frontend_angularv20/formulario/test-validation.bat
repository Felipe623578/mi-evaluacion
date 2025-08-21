@echo off
echo Probando validación con datos exactos de Angular...
echo.

curl -X POST ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"first_name\":\"felipe\",\"last_name\":\"prueba\",\"birth_date\":\"1989-10-10\",\"age\":\"35\",\"profession\":\"Programmer\",\"address\":\"avdadsfsdfsdffdffffffffffffffffffffffffffff\",\"phone\":\"2314569874\",\"email\":\"felipe@example.com\",\"photo_url\":\"C:\\\\fakepath\\\\hul.png\"}" ^
  http://localhost:8000/api/persons

echo.
echo.
echo Si ves error 422, significa que Laravel está rechazando los datos por validación
echo.
pause
