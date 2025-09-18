# 🌟 NEON LEARN - Plataforma de Aprendizaje Gamificada

Una plataforma de aprendizaje futurista con gamificación completa, estilo cyberpunk neon y animaciones envolventes.

## 🚀 Características Principales

- ✨ **Diseño Futurista**: Estilo cyberpunk con efectos neon, gradientes vibrantes y animaciones fluidas
- 🎮 **Gamificación Completa**: Sistema de XP, niveles, medallas y progreso visual
- 🫧 **Animaciones Inmersivas**: Burbujas flotantes que representan conocimiento en crecimiento
- 📊 **Dashboard Interactivo**: Progreso circular, estadísticas y recompensas en tiempo real
- 🔐 **Autenticación Segura**: Sistema completo con JWT y bcrypt
- 📱 **Responsive**: Optimizado para desktop, tablet y móvil

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js + Express**: Servidor API REST
- **MongoDB**: Base de datos NoSQL para usuarios y progreso
- **JWT**: Autenticación segura con tokens
- **bcryptjs**: Encriptación de contraseñas
- **CORS**: Habilitación de peticiones cross-origin

### Frontend
- **React 18**: Framework frontend moderno
- **Tailwind CSS**: Estilos utilitarios y responsive
- **Framer Motion**: Animaciones fluidas y transiciones
- **Vite**: Bundler rápido y optimizado

## 📂 Estructura del Proyecto

```
neon-learn/
├── backend/
│   ├── server.js          # Servidor principal
│   ├── package.json       # Dependencias backend
│   └── README.md          # Documentación
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Componente principal
│   │   ├── main.jsx       # Punto de entrada
│   │   └── index.css      # Estilos globales
│   ├── index.html         # HTML principal
│   ├── package.json       # Dependencias frontend
│   ├── vite.config.js     # Configuración Vite
│   └── tailwind.config.js # Configuración Tailwind
└── README.md              # Este archivo
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ instalado
- MongoDB instalado localmente O cuenta en MongoDB Atlas
- Git (opcional)

### 1. Configurar Backend

```bash
# Crear directorio del proyecto
mkdir neon-learn
cd neon-learn

# Crear directorio backend
mkdir backend
cd backend

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias
npm install express mongoose bcryptjs jsonwebtoken cors dotenv

# Instalar dependencia de desarrollo
npm install -D nodemon

# Copiar el código del servidor (server.js)
# Copiar el package.json del backend

# Iniciar servidor
npm start
# O para desarrollo con auto-reload:
npm run dev
```

### 2. Configurar Frontend

```bash
# Ir al directorio raíz del proyecto
cd ..

# Crear proyecto React con Vite
npm create vite@latest frontend -- --template react
cd frontend

# Instalar dependencias adicionales
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Copiar todos los archivos del frontend
# (App.jsx, index.css, tailwind.config.js, etc.)

# Instalar todas las dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Configurar Base de Datos

#### Opción A: MongoDB Local
```bash
# Instalar MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Iniciar MongoDB
mongod

# El servidor se conectará automáticamente a mongodb://localhost:27017/neonlearn
```

#### Opción B: MongoDB Atlas (Recomendado)
1. Crear cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Obtener URI de conexión
4. Crear archivo `.env` en el directorio backend:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neonlearn
JWT_SECRET=tu_clave_secreta_super_segura_2024
PORT=5000
```

## 🚀 Ejecutar la Aplicación

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
# Servidor corriendo en http://localhost:5000
