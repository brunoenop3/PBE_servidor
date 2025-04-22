const mongoose = require('mongoose');
const Student = require('./models/Student');
const Task = require('./models/Task');
const Mark = require('./models/Mark');
const Timetable = require('./models/Timetable');

// Cambia esto si tu base de datos tiene otro nombre
const MONGO_URI = 'mongodb://localhost:27017/pbe';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    // UIDs de prueba
    const estudiantes = [
      { uid: 'abc123', name: 'Juan Pérez' },
      { uid: 'def456', name: 'María García' }
    ];

    await Student.deleteMany({});
    await Task.deleteMany({});
    await Mark.deleteMany({});
    await Timetable.deleteMany({});

    await Student.insertMany(estudiantes);

    await Task.insertMany([
      {
        title: 'Matemáticas',
        description: 'Ejercicios de integrales',
        date: new Date(),
        subject: 'Math',
        student_uid: 'abc123'
      },
      {
        title: 'Historia',
        description: 'Resumen del siglo XX',
        date: new Date(),
        subject: 'History',
        student_uid: 'def456'
      }
    ]);

    await Mark.insertMany([
      { subject: 'Math', value: 9, student_uid: 'abc123' },
      { subject: 'History', value: 7.5, student_uid: 'def456' }
    ]);

    await Timetable.insertMany([
      { day: 'Monday', hour: '08:00', subject: 'Math', room: '101', teacher: 'Ana' },
      { day: 'Tuesday', hour: '10:00', subject: 'History', room: '202', teacher: 'Luis' }
    ]);

    console.log('Datos de prueba insertados correctamente.');
  } catch (err) {
    console.error('Error en seed:', err);
  } finally {
    mongoose.disconnect();
  }
};

run();
