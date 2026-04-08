/**
 * Seed script — Full Spectrum Seeding.
 * Generates 100+ students, 20+ coaches, and populates all modules.
 * Usage: node src/seed.js
 */
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const User     = require('./models/User');
const Event    = require('./models/Event');
const Sport    = require('./models/Sport');
const Batch    = require('./models/Batch');
const Fee      = require('./models/Fee');
const Attendance = require('./models/Attendance');
const Performance = require('./models/Performance');
const InventoryItem = require('./models/InventoryItem');
const AcademySettings = require('./models/AcademySettings');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sport_faction';

const FIRST_NAMES = [
  'Aarav', 'Aryan', 'Advait', 'Ishaan', 'Kabir', 'Rohan', 'Vihaan', 'Arjun', 'Sai', 'Krishna',
  'Ananya', 'Diya', 'Meera', 'Sana', 'Zara', 'Kyra', 'Tanvi', 'Priya', 'Isha', 'Riya',
  'Dev', 'Karan', 'Nikita', 'Sneha', 'Rahul', 'Vivek', 'Aditi', 'Simran', 'Kavya', 'Navya'
];
const SURNAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Rao', 'Nair', 'Malhotra', 'Patel', 'Ibrahim',
  'Deshmukh', 'Khan', 'Mishra', 'Joshi', 'Reddy', 'Mehta', 'Bose', 'Chatterjee', 'Dubey', 'Saxena'
];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function generateName() { return `${getRandom(FIRST_NAMES)} ${getRandom(SURNAMES)}`; }

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // 1. Clear existing (except admin)
  await User.deleteMany({ email: { $ne: 'admin@sportfaction.in' } });
  await Sport.deleteMany({});
  await Batch.deleteMany({});
  await Event.deleteMany({});
  await Fee.deleteMany({});
  await Attendance.deleteMany({});
  await Performance.deleteMany({});
  await InventoryItem.deleteMany({});
  await AcademySettings.deleteMany({});
  console.log('🧹 Database cleared for full specturm seed');

  // 2. Settings
  const admin = await User.findOne({ email: 'admin@sportfaction.in' });
  await AcademySettings.create({
    academyName: 'Sport Faction Elite Academy',
    tagline: 'Precision. Power. Performance.',
    sportsOffered: ['badminton', 'skating', 'pickleball'],
    feeDefaults: { admissionFee: 2000, monthlyFee: 3000, lateFeeCharge: 500, dueDayOfMonth: 5 }
  });

  // 3. Sports
  const sportsData = [
    { name: 'badminton', description: 'Olympic sport.', skillLevels: ['Beginner', 'Intermediate', 'Advanced'], feeStructure: 3500 },
    { name: 'skating', description: 'Roller and inline skating.', skillLevels: ['Beginner', 'Intermediate'], feeStructure: 2500 },
    { name: 'pickleball', description: 'Fastest growing sport.', skillLevels: ['Beginner', 'Intermediate', 'Advanced'], feeStructure: 3000 },
  ];
  const sports = await Sport.insertMany(sportsData);
  console.log('🏸 Sports initialized');

  // 4. Coaches (20)
  const coaches = [];
  for (let i = 1; i <= 20; i++) {
    const name = generateName();
    const sport = getRandom(['badminton', 'skating', 'pickleball']);
    const c = await User.create({
      name: `Coach ${name}`,
      email: `coach${i}@sportfaction.in`,
      password: 'Coach@1234',
      role: 'coach',
      phone: `+91 99900 ${10000 + i}`,
      sport: sport
    });
    coaches.push(c);
  }
  console.log('👨‍🏫 20 Coaches generated');

  // 5. Batches (15)
  const batches = [];
  const batchSlots = ['6:00 AM – 7:30 AM', '7:30 AM – 9:00 AM', '4:30 PM – 6:00 PM', '6:00 PM – 7:30 PM'];
  const daysOptions = [['Mon', 'Wed', 'Fri'], ['Tue', 'Thu', 'Sat'], ['Sat', 'Sun']];
  
  for (let i = 1; i <= 15; i++) {
    const sport = getRandom(['badminton', 'skating', 'pickleball']);
    const coach = getRandom(coaches.filter(c => c.sport === sport) || [coaches[0]]);
    const b = await Batch.create({
      name: `Batch ${String.fromCharCode(64 + i)} ${sport.toUpperCase()}`,
      sport: sport,
      timeSlot: getRandom(batchSlots),
      days: getRandom(daysOptions),
      coach: coach._id,
      coachName: coach.name,
      venue: `Area ${i}`,
      capacity: 15
    });
    batches.push(b);
  }
  console.log('📅 15 Batches generated');

  // 6. Students (100)
  const students = [];
  for (let i = 1; i <= 100; i++) {
    const name = generateName();
    const batch = getRandom(batches);
    const s = await User.create({
      name: name,
      email: `student${i}@demo.com`,
      password: 'Student@1234',
      role: 'student',
      phone: `+91 90000 ${20000 + i}`,
      sport: batch.sport,
      batch: batch.name,
      coachName: batch.coachName,
      feeStatus: getRandom(['paid', 'pending', 'overdue']),
      studentId: `SF2025${String(i).padStart(3, '0')}`
    });
    students.push(s);
  }
  console.log('🎓 100 Students generated');

  // 7. Fees
  const feeTypes = ['admission', 'monthly', 'coaching'];
  for (const s of students) {
    await Fee.create({
      student: s._id,
      studentName: s.name,
      batch: s.batch,
      sport: s.sport,
      feeType: getRandom(feeTypes),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalAmount: 3000,
      paidAmount: s.feeStatus === 'paid' ? 3000 : 0,
      status: s.feeStatus,
      paymentMode: s.feeStatus === 'paid' ? 'online' : '',
      paymentDate: s.feeStatus === 'paid' ? new Date() : null,
    });
  }
  console.log('💰 100 Fee records generated');

  // 8. Attendance (last 5 days)
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  for (const date of dates) {
    const sampleStudents = students.slice(0, 30); // Mark attendance for 30 students to keep it manageable
    for (const s of sampleStudents) {
      try {
        await Attendance.create({
          student: s._id,
          date: date,
          sport: s.sport,
          batch: s.batch,
          present: Math.random() > 0.1,
          markedBy: admin._id
        });
      } catch (e) { /* ignore duplicates */ }
    }
  }
  console.log('📝 Attendance records generated for last 5 days');

  // 9. Performance (Evaluation)
  const performanceStudents = students.slice(0, 20);
  for (const s of performanceStudents) {
    const coach = coaches.find(c => c.name === s.coachName) || coaches[0];
    const metrics = {
      footwork: Math.floor(Math.random() * 10),
      stamina: Math.floor(Math.random() * 10),
      discipline: Math.floor(Math.random() * 10),
      fitness: Math.floor(Math.random() * 10),
      teamwork: Math.floor(Math.random() * 10),
    };
    if (s.sport === 'badminton') {
      metrics.serveAccuracy = Math.floor(Math.random() * 10);
      metrics.smashControl = Math.floor(Math.random() * 10);
    }

    const ratings = Object.values(metrics);
    const overall = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

    await Performance.create({
      student: s._id,
      studentName: s.name,
      sport: s.sport,
      coach: coach._id,
      coachName: coach.name,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      metrics: metrics,
      overallRating: overall,
      coachFeedback: 'Great progress this month. Keep practicing the fundamentals.',
      matchStats: { played: 5, won: 3, lost: 2 }
    });
  }
  console.log('📈 20 Performance evaluations generated');

  // 10. Inventory
  const inventoryData = [
    { name: 'Yonex Mavis 350 Shuttlecocks', category: 'shuttlecock', quantity: 120, lowStockThreshold: 20, vendor: 'Yonex India' },
    { name: 'Training Rackets', category: 'racket', quantity: 25, lowStockThreshold: 5, vendor: 'Local Sports' },
    { name: 'Pickleball Balls (Pack of 3)', category: 'ball', quantity: 50, lowStockThreshold: 10, vendor: 'Pickle Pro' },
    { name: 'Skating Cones', category: 'cone', quantity: 100, lowStockThreshold: 15, vendor: 'Training Gear Co.' },
    { name: 'Professional Net 20ft', category: 'net', quantity: 8, lowStockThreshold: 2, vendor: 'Court Supply' },
    { name: 'Academy Jerseys (M)', category: 'jersey', quantity: 45, lowStockThreshold: 10 },
    { name: 'Speed Jump Ropes', category: 'fitness', quantity: 30, lowStockThreshold: 5 },
  ];
  await InventoryItem.insertMany(inventoryData);
  console.log('📦 Inventory items initialized');

  // 11. Events (10)
  const eventTitles = ['Tournament', 'Workshop', 'Open Day', 'Meetup', 'Friendly Match'];
  for (let i = 1; i <= 10; i++) {
    await Event.create({
      title: `${getRandom(['badminton', 'skating', 'pickleball']).toUpperCase()} ${getRandom(eventTitles)} ${i}`,
      description: 'Demo event for students and members.',
      sport: getRandom(['badminton', 'skating', 'pickleball']),
      date: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)),
      location: `Court ${i}`,
      status: i > 7 ? 'completed' : 'upcoming',
      createdBy: admin._id,
    });
  }
  console.log('🎉 10 Events generated');

  console.log('\n✅ Mission Accomplished: Full Spectrum Database Seeded!');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
