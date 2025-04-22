const Timetable = require('../models/Timetable');
const Task = require('../models/Task');
const Mark = require('../models/Mark');
const Student = require('../models/Student');

// Middleware de autenticación
exports.authMiddleware = async (req, res, next) => {
  try {
    const uid = req.headers['uid'];
    if (!uid) return res.status(401).json({ error: 'Falta UID' });

    const student = await Student.findOne({ uid });
    if (!student) return res.status(403).json({ error: 'UID no registrado' });

    req.student = student;
    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(500).json({ error: 'Error interno de autenticación' });
  }
};

// Rutas públicas

exports.getTimetables = async (req, res) => {
  try {
    const filter = parseQuery(req.query);
    const limit = parseInt(req.query.limit) || null;
    const data = await Timetable.find(filter).sort({ day: 1, hour: 1 }).limit(limit);
    res.json(data);
  } catch (error) {
    console.error('Error en getTimetables:', error);
    res.status(500).json({ error: 'Error interno en getTimetables' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = parseQuery(req.query);
    const tasks = await Task.find(filter).sort({ date: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error en getTasks:', error);
    res.status(500).json({ error: 'Error interno en getTasks' });
  }
};

// Rutas protegidas

exports.getMarks = async (req, res) => {
  try {
    const filter = { student_uid: req.student.uid, ...parseQuery(req.query) };
    const marks = await Mark.find(filter).sort({ subject: 1 });
    res.json(marks);
  } catch (error) {
    console.error('Error en getMarks:', error);
    res.status(500).json({ error: 'Error interno en getMarks' });
  }
};

exports.getMe = (req, res) => {
  try {
    res.json({ uid: req.student.uid, name: req.student.name });
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error interno en getMe' });
  }
};

exports.getUserByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const student = await Student.findOne({ uid });
    if (!student) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ name: student.name });
  } catch (error) {
    console.error('Error en getUserByUid:', error);
    res.status(500).json({ error: 'Error interno en getUserByUid' });
  }
};

// Parseador de queries
function parseQuery(query) {
  const result = {};
  const validOps = ['gte', 'gt', 'lte', 'lt', 'eq'];

  for (const key in query) {
    if (key === 'limit') continue;

    if (key.includes('[')) {
      const [field, op] = key.split(/\[|\]/);
      if (!validOps.includes(op)) continue; // Ignora operadores no válidos

      const value = query[key] === 'now'
        ? (field === 'date' ? new Date() : undefined)
        : query[key];

      if (value !== undefined) {
        if (!result[field]) result[field] = {};
        result[field][`$${op}`] = value;
      }
    } else {
      result[key] = query[key];
    }
  }
  return result;
}
