@echo off
echo Verificando instalacion de Node.js y npm...

where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js no esta instalado. Por favor instalalo desde https://nodejs.org/
    pause
    exit /b
)

where npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo npm no esta instalado. Deberia venir con Node.js. Reinstala Node.js.
    pause
    exit /b
)

echo Node.js y npm encontrados. Continuando...

IF NOT EXIST node_modules (
    echo Instalando dependencias...
    npm install
) ELSE (
    echo Dependencias ya instaladas.
)

echo Iniciando el servidor...
npm start

pause
