// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de MongoDB (reemplaza con tu URI de MongoDB Atlas)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neonlearn';
const JWT_SECRET = process.env.JWT_SECRET || 'neonlearn_secret_key_2024';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Esquema de Usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }], // Array de nombres de medallas
  lessonsCompleted: [{ type: String }], // Array de IDs de lecciones
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Función para calcular nivel basado en XP
const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

// Función para generar medallas basadas en nivel
const generateBadges = (level) => {
  const badges = [];
  if (level >= 2) badges.push('Primera Subida');
  if (level >= 3) badges.push('Aprendiz Dedicado');
  if (level >= 5) badges.push('Estudiante Avanzado');
  if (level >= 10) badges.push('Maestro del Conocimiento');
  if (level >= 15) badges.push('Leyenda Neon');
  return badges;
};

// 🔥 RUTAS DE LA API

// 1. POST /api/register - Registrar nuevo usuario
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones básicas
    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
      xp: 0,
      level: 1,
      badges: [],
      lessonsCompleted: []
    });

    await newUser.save();

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        xp: newUser.xp,
        level: newUser.level,
        badges: newUser.badges
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 2. POST /api/login - Iniciar sesión
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones básicas
    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        lessonsCompleted: user.lessonsCompleted
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 3. GET /api/progress - Obtener progreso del usuario
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Calcular progreso hacia siguiente nivel
    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = user.level * 100;
    const progressToNextLevel = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    res.json({
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      lessonsCompleted: user.lessonsCompleted,
      progressToNextLevel: Math.min(progressToNextLevel, 100),
      xpToNextLevel: Math.max(0, nextLevelXP - user.xp)
    });

  } catch (error) {
    console.error('Error obteniendo progreso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 4. POST /api/lesson/complete - Completar lección
app.post('/api/lesson/complete', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.body;
    
    if (!lessonId) {
      return res.status(400).json({ message: 'ID de lección requerido' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la lección ya fue completada
    if (user.lessonsCompleted.includes(lessonId)) {
      return res.status(400).json({ message: 'Lección ya completada' });
    }

    // Actualizar progreso
    const oldLevel = user.level;
    user.xp += 20; // +20 XP por lección
    user.level = calculateLevel(user.xp);
    user.lessonsCompleted.push(lessonId);

    // Verificar si subió de nivel y actualizar medallas
    let leveledUp = false;
    if (user.level > oldLevel) {
      leveledUp = true;
      user.badges = generateBadges(user.level);
    }

    await user.save();

    // Calcular progreso hacia siguiente nivel
    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = user.level * 100;
    const progressToNextLevel = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    res.json({
      message: 'Lección completada exitosamente',
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      lessonsCompleted: user.lessonsCompleted,
      progressToNextLevel: Math.min(progressToNextLevel, 100),
      xpToNextLevel: Math.max(0, nextLevelXP - user.xp),
      xpEarned: 20,
      leveledUp,
      newLevel: leveledUp ? user.level : null
    });

  } catch (error) {
    console.error('Error completando lección:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Neon Learn Backend está funcionando 🚀', timestamp: new Date() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
