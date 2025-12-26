const mongoose = require('mongoose');
const Staff = require('../models/staff');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/med_secure';

migrate().catch(err => { console.error(err); process.exit(1); });

async function migrate() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');
  const sample = [
    { email: 'admin@hospital.com' },
    { email: 'doctor1@hospital.com' },
    { email: 'nurse1@hospital.com' }
  ];
  for (const s of sample) {
    try {
      await Staff.updateOne({ email: s.email }, { $setOnInsert: s }, { upsert: true });
      console.log('Seeded', s.email);
    } catch (e) {
      console.error('Error seeding', s.email, e.message);
    }
  }
  await mongoose.disconnect();
  console.log('Seeding finished');
}
