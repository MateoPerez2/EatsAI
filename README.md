EatsAI es un proyecto fullstack que combina un frontend hecho en React Native (Expo) con un backend en Node/Express, usando MongoDB como base de datos. El objetivo es registrar y analizar ingestas de comidas, mostrar estadísticas (con gráficas de calorías, macros, peso) y utilizar IA (OpenAI) para estimar macros a partir de imágenes de comidas.

- Características Principales

    - Autenticación con JWT (tokens de acceso y refresh tokens) y endpoints para registro, login, logout, etc.
    - Análisis IA de comidas usando la API de OpenAI. Envías una foto, te devuelve estimaciones de calorías y macros.
    - Sección de analíticas: gráficos de calorías diarias, macros pasadas, peso histórico y progreso de metas.
    - Base de datos en MongoDB para almacenar usuarios, intakes, weight logs, metas, etc.
    - Frontend en React Native con Expo, integrando bibliotecas como react-native-chart-kit para visualizar datos, - react-navigation para la navegación, y un flujo con pantallas de Login, Registro, Home, Análisis, Ajustes, etc.
    - Traducciones: se incluye un sistema i18n con varios idiomas (inglés, español, francés).
    - Seed de datos: script para poblar la BD con intakes y pesos de prueba.

- Instalación
    - git clone https://github.com/MateoPerez2/EatsAI.git
    - npm i
    - npx expo install
    - cd backend
    - npm i
    - Crea un archivo .env basado en .env.example con tus valores reales
    - Inserta tu ip de prueba en config.js
    - (Opcional) node seed.js
    - Inicia el servidor npm start
    - cd ..
    - npx expo start

- Funcionalidades del Frontend

    Login/Registro: formulario para autenticarte y obtener el accessToken/refreshToken.
    Home: muestra resumen de calorías de hoy, macros consumidas, lista de comidas recientes.
    AnalyzeScreen: sube una foto y llama a /api/analyze-structured para estimar macros.
    ManualIntakeScreen: añadir comidas manualmente.
    AnalyticsScreen: gráficas de calorías diarias, macros mensuales, histórico de peso, meta de peso (si está definida).
    SettingsScreen: cambiar idioma, meta, cerrar sesión, etc.


- Funcionalidades del Backend

    Autenticación (JWT con refresh tokens):
    /api/auth/register: crea usuario nuevo.
    /api/auth/login: retorna access y refresh tokens.
    /api/auth/refresh: intercambia refreshToken por un nuevo accessToken.
    /api/auth/logout: anula el refreshToken.
    Análisis IA (/api/analyze-structured): recibe imagen base64 y llama OpenAI, devolviendo calorías y macros estimadas.
    Intakes (/api/intakes):
    GET /: lista intakes de un usuario (opcional filtro por fecha).
    POST /: crea un intake con { meal, calories, macros, date }.
    Analytics (/api/analytics):
    /daily-calories: calorías agrupadas por día (últimos X días).
    /past-30-days-macros: macros para los últimos 30 días.
    /monthly-macros?year=YYYY: macros por mes.
    /weight-history?days=N: logs de peso.
    /goal-progress: calcula progreso hacia meta de peso.
    Seed (seed.js): inserta intakes aleatorios de ~90 días.


- IA con OpenAI

    En analyze-structured, se manda un cuerpo JSON con imageData: "data:image/jpeg;base64,...".
    El backend llama a la API de OpenAI y retorna un objeto con calories, carbs, protein, fats, notes.
    El frontend recibe esos valores, los muestra y/o crea el intake.


- Endpoints Principales

    Auth (/api/auth/):
    POST /register, POST /login, POST /refresh, POST /logout, POST /forgot-password, POST /reset-password.
    Analyze (/api/analyze-structured):
    Recibe la imagen, llama a OpenAI.
    Intakes (/api/intakes, GET /api/intakes/stats).
    Analytics (/api/analytics/daily-calories, etc.).
    Goal (opcional) (/api/goal) para definir metas de peso/macro.


- Autenticación JWT y Refresh Tokens

    Al hacer login se retorna { accessToken, refreshToken, user }.
    Access Token (válido ~15 min) se manda en la cabecera Authorization: Bearer <accessToken>.
    Refresh Token (válido ~7 días) se guarda aparte (AsyncStorage).
    Cuando el access token expira, el frontend llama /api/auth/refresh con el refreshToken para obtener un nuevo accessToken.
    Logout invalida el refreshToken en la base de datos.


- Traducciones (i18n)

    En el frontend, se definen strings en varios idiomas, y se usa useTranslation() para traducir claves como t('loginButton').
    Se guarda el idioma en AsyncStorage o en el contexto global.
    Ejemplo: 'en', 'es', 'fr'.


