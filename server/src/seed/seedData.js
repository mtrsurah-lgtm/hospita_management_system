const mongoose = require('mongoose');
require('dotenv').config();

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Billing = require('../models/Billing');

const seedHospitalData = async (isStandalone = false) => {
  try {
    if (isStandalone) {
      console.log('[Seeder] Connecting to database...');
      await connectDB();
    }

    console.log('[Seeder] Clearing old records...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Billing.deleteMany({});

    console.log('[Seeder] Creating Users...');
    // 1. Admin
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@hospital.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    // 2. Staff / Receptionist
    const staffUser = await User.create({
      name: 'Sarah receptionist',
      email: 'staff@hospital.com',
      password: 'Staff@123',
      role: 'staff',
      phone: '+1 (555) 014-9982',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    });

    // 3. Doctor Users
    const docUser1 = await User.create({
      name: 'Dr. Sarah Jenkins, MD',
      email: 'doctor.sarah@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 018-7744',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    });

    const docUser2 = await User.create({
      name: 'Dr. Robert Chen, PhD',
      email: 'doctor.robert@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 013-4411',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    });

    const docUser3 = await User.create({
      name: 'Dr. Emily Watson, MD',
      email: 'doctor.emily@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 012-6633',
      avatar: 'https://images.unsplash.com/photo-1594824813512-257ebc81882f?w=150',
    });

    const docUser4 = await User.create({
      name: 'Dr. Marcus Vance, MS',
      email: 'doctor.marcus@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 017-8822',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    });

    // 4. Patient Users
    const patientUser1 = await User.create({
      name: 'John Doe',
      email: 'patient.john@hospital.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 482-9901',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const patientUser2 = await User.create({
      name: 'Emma Davis',
      email: 'patient.emma@hospital.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 391-7440',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    });

    const patientUser3 = await User.create({
      name: 'Michael Brown',
      email: 'patient.michael@hospital.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 293-1122',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    });

    console.log('[Seeder] Creating Departments...');
    const deptCardio = await Department.create({
      name: 'Cardiology',
      description: 'Comprehensive cardiovascular diagnosis, intervention, and preventive cardiac care.',
      icon: 'Heart',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500',
    });

    const deptNeuro = await Department.create({
      name: 'Neurology',
      description: 'Expert diagnostics and therapeutics for neurological, cognitive, and brain disorders.',
      icon: 'Brain',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500',
    });

    const deptPedia = await Department.create({
      name: 'Pediatrics',
      description: 'Gentle, dedicated clinical care and immunizations for infants, children, and adolescents.',
      icon: 'Baby',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500',
    });

    const deptOrtho = await Department.create({
      name: 'Orthopedics',
      description: 'Advanced joint replacement, spinal rehabilitation, and sports injury recovery.',
      icon: 'Bone',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500',
    });

    const deptGeneral = await Department.create({
      name: 'General Medicine',
      description: 'Primary internal healthcare, preventative wellness assessments, and triage.',
      icon: 'Activity',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500',
    });

    console.log('[Seeder] Creating Doctor Profiles...');
    const doctor1 = await Doctor.create({
      userId: docUser1._id,
      departmentId: deptCardio._id,
      specialization: 'Interventional Cardiology',
      qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
      experienceYears: 14,
      consultationFee: 120,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['09:00 - 09:30', '10:00 - 10:30', '11:00 - 11:30', '14:00 - 14:30', '15:00 - 15:30'],
      roomNumber: 'OPD-Cardio-201',
      bio: 'Senior consultant cardiologist specializing in coronary artery disease and heart rhythm management.',
    });
    deptCardio.headDoctor = doctor1._id;
    await deptCardio.save();

    const doctor2 = await Doctor.create({
      userId: docUser2._id,
      departmentId: deptNeuro._id,
      specialization: 'Clinical Neurophysiology',
      qualifications: ['MBBS', 'MD Neurology', 'PhD Neuroscience'],
      experienceYears: 11,
      consultationFee: 140,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['10:00 - 10:30', '11:00 - 11:30', '14:30 - 15:00', '15:30 - 16:00'],
      roomNumber: 'OPD-Neuro-305',
      bio: 'Fellowship trained neurologist focusing on migraines, epilepsy, and neurodegenerative therapeutics.',
    });
    deptNeuro.headDoctor = doctor2._id;
    await deptNeuro.save();

    const doctor3 = await Doctor.create({
      userId: docUser3._id,
      departmentId: deptPedia._id,
      specialization: 'Pediatric Critical Care',
      qualifications: ['MBBS', 'DCH', 'MD Pediatrics'],
      experienceYears: 8,
      consultationFee: 90,
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['09:30 - 10:00', '10:30 - 11:00', '13:00 - 13:30', '14:00 - 14:30'],
      roomNumber: 'OPD-Pedia-102',
      bio: 'Dedicated pediatrician with clinical passion for developmental health and early pediatric medicine.',
    });
    deptPedia.headDoctor = doctor3._id;
    await deptPedia.save();

    const doctor4 = await Doctor.create({
      userId: docUser4._id,
      departmentId: deptOrtho._id,
      specialization: 'Orthopedic Surgery & Arthroplasty',
      qualifications: ['MBBS', 'MS Orthopedics', 'FRCS'],
      experienceYears: 16,
      consultationFee: 150,
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
      timeSlots: ['09:00 - 09:30', '11:00 - 11:30', '15:00 - 15:30', '16:00 - 16:30'],
      roomNumber: 'OPD-Ortho-410',
      bio: 'Chief orthopedic surgeon specializing in knee and hip joint replacements and sports medicine.',
    });
    deptOrtho.headDoctor = doctor4._id;
    await deptOrtho.save();

    console.log('[Seeder] Creating Patient Profiles...');
    const patient1 = await Patient.create({
      userId: patientUser1._id,
      dateOfBirth: new Date('1988-06-15'),
      gender: 'Male',
      bloodGroup: 'O+',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
      },
      emergencyContact: {
        name: 'Martha Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 482-9902',
      },
      medicalHistory: [
        { condition: 'Mild Hypertension', diagnosedDate: new Date('2021-03-10'), notes: 'Controlled with lifestyle & ACE inhibitor' },
      ],
      allergies: ['Penicillin', 'Peanuts'],
      insuranceProvider: 'Blue Cross Shield',
      insurancePolicyNumber: 'BCS-99281-22',
    });

    const patient2 = await Patient.create({
      userId: patientUser2._id,
      dateOfBirth: new Date('1994-11-23'),
      gender: 'Female',
      bloodGroup: 'A+',
      address: {
        street: '128 Ocean Avenue',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
      },
      emergencyContact: {
        name: 'David Davis',
        relationship: 'Brother',
        phone: '+1 (555) 391-7441',
      },
      medicalHistory: [
        { condition: 'Migraine with Aura', diagnosedDate: new Date('2022-08-14'), notes: 'Triggered by stress and lack of sleep' },
      ],
      allergies: ['Sulfa drugs'],
      insuranceProvider: 'Aetna Health',
      insurancePolicyNumber: 'AET-44820-99',
    });

    const patient3 = await Patient.create({
      userId: patientUser3._id,
      dateOfBirth: new Date('2001-02-18'),
      gender: 'Male',
      bloodGroup: 'B+',
      address: {
        street: '45 Lakeview Dr',
        city: 'Oakland',
        state: 'CA',
        postalCode: '94601',
      },
      emergencyContact: {
        name: 'Susan Brown',
        relationship: 'Mother',
        phone: '+1 (555) 293-1123',
      },
      medicalHistory: [],
      allergies: [],
      insuranceProvider: 'UnitedHealthcare',
      insurancePolicyNumber: 'UHC-10293-81',
    });

    console.log('[Seeder] Creating Appointments...');
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);
    const yesterday = new Date(Date.now() - 86400000);

    const appt1 = await Appointment.create({
      patientId: patient1._id,
      doctorId: doctor1._id,
      departmentId: deptCardio._id,
      appointmentDate: yesterday,
      timeSlot: '09:00 - 09:30',
      status: 'Completed',
      reasonForVisit: 'Routine cardiac stress check and medication review',
      type: 'Consultation',
      tokenNumber: 1,
      notes: 'Patient completed ECG and vitals check.',
    });

    const appt2 = await Appointment.create({
      patientId: patient2._id,
      doctorId: doctor2._id,
      departmentId: deptNeuro._id,
      appointmentDate: today,
      timeSlot: '10:00 - 10:30',
      status: 'Confirmed',
      reasonForVisit: 'Frequent throbbing temporal headaches',
      type: 'Consultation',
      tokenNumber: 1,
    });

    const appt3 = await Appointment.create({
      patientId: patient3._id,
      doctorId: doctor4._id,
      departmentId: deptOrtho._id,
      appointmentDate: tomorrow,
      timeSlot: '11:00 - 11:30',
      status: 'Confirmed',
      reasonForVisit: 'Right knee pain following marathon workout',
      type: 'Routine Checkup',
      tokenNumber: 2,
    });

    console.log('[Seeder] Creating Medical Records / Prescriptions...');
    await MedicalRecord.create({
      appointmentId: appt1._id,
      patientId: patient1._id,
      doctorId: doctor1._id,
      diagnosis: 'Stage 1 Essential Hypertension (Stable)',
      symptoms: ['Mild morning headaches', 'Elevated resting diastolic pressure'],
      prescriptions: [
        {
          medicine: 'Lisinopril 10mg',
          dosage: '1 tablet',
          frequency: 'Once daily (morning)',
          duration: '30 days',
          instructions: 'Take with water before breakfast',
        },
        {
          medicine: 'Hydrochlorothiazide 12.5mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take in morning',
        },
      ],
      labTests: [
        {
          testName: 'Complete Metabolic Panel (CMP)',
          status: 'Completed',
          resultDate: yesterday,
          resultNotes: 'Creatinine and electrolytes within standard limits',
        },
        {
          testName: 'Lipid Panel Profile',
          status: 'Sample Collected',
          resultNotes: 'Awaiting lab analysis results',
        },
      ],
      vitals: {
        bloodPressure: '132/84 mmHg',
        heartRate: '72 bpm',
        temperature: '98.6 °F',
        weight: '78 kg',
        respiratoryRate: '16 rpm',
      },
      notes: 'Recommend reducing dietary sodium below 2,000mg/day and engaging in 30 mins brisk walking.',
      followUpDate: new Date(Date.now() + 30 * 86400000),
    });

    console.log('[Seeder] Creating Billing Invoices...');
    await Billing.create({
      patientId: patient1._id,
      appointmentId: appt1._id,
      invoiceNumber: 'INV-2026-00001',
      items: [
        { description: 'Cardiology Specialist Consultation', amount: 120, quantity: 1 },
        { description: 'Resting Electrocardiogram (ECG)', amount: 65, quantity: 1 },
        { description: 'Complete Metabolic Panel Lab Test', amount: 45, quantity: 1 },
      ],
      subtotal: 230,
      tax: 0,
      discount: 20,
      totalAmount: 210,
      paidAmount: 210,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
    });

    await Billing.create({
      patientId: patient2._id,
      appointmentId: appt2._id,
      invoiceNumber: 'INV-2026-00002',
      items: [
        { description: 'Neurology Consultation', amount: 140, quantity: 1 },
      ],
      subtotal: 140,
      tax: 0,
      discount: 0,
      totalAmount: 140,
      paidAmount: 0,
      paymentStatus: 'Pending',
      paymentMethod: 'Insurance',
    });

    console.log('\n=============================================================');
    console.log('  SUCCESS: Seed data populated successfully!');
    console.log('=============================================================');
    console.log('  ADMIN CREDENTIALS:');
    console.log('    Email:    admin@hospital.com');
    console.log('    Password: Admin@123\n');
    console.log('  DOCTOR CREDENTIALS:');
    console.log('    Email:    doctor.sarah@hospital.com (Cardiology)');
    console.log('    Email:    doctor.robert@hospital.com (Neurology)');
    console.log('    Password: Doctor@123\n');
    console.log('  STAFF CREDENTIALS:');
    console.log('    Email:    staff@hospital.com');
    console.log('    Password: Staff@123\n');
    console.log('  PATIENT CREDENTIALS:');
    console.log('    Email:    patient.john@hospital.com');
    console.log('    Password: Patient@123');
    console.log('=============================================================\n');

    if (isStandalone) {
      await disconnectDB();
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('[Seeder Error]:', error);
    if (isStandalone) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedHospitalData(true);
}

module.exports = { seedHospitalData };

