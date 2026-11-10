// Autonomous In-Browser Local Database Engine for Hospital Management System
// Runs 100% offline, on any network or device, with ZERO backend or localhost requirement.
// Automatically persists state to localStorage and supports full CRUD operations.

const STORAGE_KEY = 'hms_offline_database_v1';

const getInitialSeedData = () => {
  const users = [
    {
      _id: 'user-admin',
      name: 'System Administrator',
      email: 'admin@hospital.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      _id: 'user-staff',
      name: 'Sarah receptionist',
      email: 'staff@hospital.com',
      password: 'Staff@123',
      role: 'staff',
      phone: '+1 (555) 014-9982',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      isActive: true,
      createdAt: '2026-01-02T00:00:00.000Z',
    },
    {
      _id: 'user-doc-1',
      name: 'Dr. Sarah Jenkins, MD',
      email: 'doctor.sarah@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 018-7744',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      isActive: true,
      createdAt: '2026-01-03T00:00:00.000Z',
    },
    {
      _id: 'user-doc-2',
      name: 'Dr. Robert Chen, PhD',
      email: 'doctor.robert@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 013-4411',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      isActive: true,
      createdAt: '2026-01-04T00:00:00.000Z',
    },
    {
      _id: 'user-doc-3',
      name: 'Dr. Emily Watson, MD',
      email: 'doctor.emily@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 012-6633',
      avatar: '/images/dr-emily-watson.jpg',
      isActive: true,
      createdAt: '2026-01-05T00:00:00.000Z',
    },
    {
      _id: 'user-doc-4',
      name: 'Dr. Marcus Vance, MS',
      email: 'doctor.marcus@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 017-8822',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
      isActive: true,
      createdAt: '2026-01-06T00:00:00.000Z',
    },
    {
      _id: 'user-pat-1',
      name: 'John Doe',
      email: 'patient.john@hospital.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 482-9901',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isActive: true,
      createdAt: '2026-01-07T00:00:00.000Z',
    },
    {
      _id: 'user-pat-2',
      name: 'Emma Davis',
      email: 'patient.emma@hospital.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 391-7440',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isActive: true,
      createdAt: '2026-01-08T00:00:00.000Z',
    },
    {
      _id: 'user-pat-3',
      name: 'Michael Brown',
      email: 'patient.michael@hospital.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 293-1122',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isActive: true,
      createdAt: '2026-01-09T00:00:00.000Z',
    },
  ];

  const departments = [
    {
      _id: 'dept-cardio',
      name: 'Cardiology',
      description: 'Comprehensive cardiovascular diagnosis, intervention, and preventive cardiac care.',
      icon: 'Heart',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500',
      isActive: true,
      headDoctor: 'doc-profile-1',
    },
    {
      _id: 'dept-neuro',
      name: 'Neurology',
      description: 'Expert diagnostics and therapeutics for neurological, cognitive, and brain disorders.',
      icon: 'Brain',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500',
      isActive: true,
      headDoctor: 'doc-profile-2',
    },
    {
      _id: 'dept-pedia',
      name: 'Pediatrics',
      description: 'Gentle, dedicated clinical care and immunizations for infants, children, and adolescents.',
      icon: 'Baby',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500',
      isActive: true,
      headDoctor: 'doc-profile-3',
    },
    {
      _id: 'dept-ortho',
      name: 'Orthopedics',
      description: 'Advanced joint replacement, spinal rehabilitation, and sports injury recovery.',
      icon: 'Bone',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500',
      isActive: true,
      headDoctor: 'doc-profile-4',
    },
    {
      _id: 'dept-general',
      name: 'General Medicine',
      description: 'Primary internal healthcare, preventative wellness assessments, and triage.',
      icon: 'Activity',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500',
      isActive: true,
      headDoctor: null,
    },
  ];

  const doctors = [
    {
      _id: 'doc-profile-1',
      userId: 'user-doc-1',
      departmentId: 'dept-cardio',
      specialization: 'Interventional Cardiology',
      qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
      experienceYears: 14,
      consultationFee: 120,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['09:00 - 09:30', '10:00 - 10:30', '11:00 - 11:30', '14:00 - 14:30', '15:00 - 15:30'],
      roomNumber: 'OPD-Cardio-201',
      bio: 'Senior consultant cardiologist specializing in coronary artery disease and heart rhythm management.',
    },
    {
      _id: 'doc-profile-2',
      userId: 'user-doc-2',
      departmentId: 'dept-neuro',
      specialization: 'Clinical Neurophysiology',
      qualifications: ['MBBS', 'MD Neurology', 'PhD Neuroscience'],
      experienceYears: 11,
      consultationFee: 140,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['10:00 - 10:30', '11:00 - 11:30', '14:30 - 15:00', '15:30 - 16:00'],
      roomNumber: 'OPD-Neuro-305',
      bio: 'Fellowship trained neurologist focusing on migraines, epilepsy, and neurodegenerative therapeutics.',
    },
    {
      _id: 'doc-profile-3',
      userId: 'user-doc-3',
      departmentId: 'dept-pedia',
      specialization: 'Pediatric Critical Care',
      qualifications: ['MBBS', 'DCH', 'MD Pediatrics'],
      experienceYears: 8,
      consultationFee: 90,
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['09:30 - 10:00', '10:30 - 11:00', '13:00 - 13:30', '14:00 - 14:30'],
      roomNumber: 'OPD-Pedia-102',
      bio: 'Dedicated pediatrician with clinical passion for developmental health and early pediatric medicine.',
    },
    {
      _id: 'doc-profile-4',
      userId: 'user-doc-4',
      departmentId: 'dept-ortho',
      specialization: 'Orthopedic Surgery & Arthroplasty',
      qualifications: ['MBBS', 'MS Orthopedics', 'FRCS'],
      experienceYears: 16,
      consultationFee: 150,
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
      timeSlots: ['09:00 - 09:30', '11:00 - 11:30', '15:00 - 15:30', '16:00 - 16:30'],
      roomNumber: 'OPD-Ortho-410',
      bio: 'Chief orthopedic surgeon specializing in knee and hip joint replacements and sports medicine.',
    },
  ];

  const patients = [
    {
      _id: 'pat-profile-1',
      userId: 'user-pat-1',
      dateOfBirth: '1988-06-15T00:00:00.000Z',
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
        { condition: 'Mild Hypertension', diagnosedDate: '2021-03-10T00:00:00.000Z', notes: 'Controlled with lifestyle & ACE inhibitor' },
      ],
      allergies: ['Penicillin', 'Peanuts'],
      insuranceProvider: 'Blue Cross Shield',
      insurancePolicyNumber: 'BCS-99281-22',
      createdAt: '2026-01-07T00:00:00.000Z',
    },
    {
      _id: 'pat-profile-2',
      userId: 'user-pat-2',
      dateOfBirth: '1994-11-23T00:00:00.000Z',
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
        { condition: 'Migraine with Aura', diagnosedDate: '2022-08-14T00:00:00.000Z', notes: 'Triggered by stress and lack of sleep' },
      ],
      allergies: ['Sulfa drugs'],
      insuranceProvider: 'Aetna Health',
      insurancePolicyNumber: 'AET-44820-99',
      createdAt: '2026-01-08T00:00:00.000Z',
    },
    {
      _id: 'pat-profile-3',
      userId: 'user-pat-3',
      dateOfBirth: '2001-02-18T00:00:00.000Z',
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
      createdAt: '2026-01-09T00:00:00.000Z',
    },
  ];

  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000).toISOString();
  const today = now.toISOString();
  const tomorrow = new Date(now.getTime() + 86400000).toISOString();

  const appointments = [
    {
      _id: 'appt-1',
      patientId: 'pat-profile-1',
      doctorId: 'doc-profile-1',
      departmentId: 'dept-cardio',
      appointmentDate: yesterday,
      timeSlot: '09:00 - 09:30',
      status: 'Completed',
      reasonForVisit: 'Routine cardiac stress check and medication review',
      type: 'Consultation',
      tokenNumber: 1,
      notes: 'Patient completed ECG and vitals check.',
      createdAt: yesterday,
    },
    {
      _id: 'appt-2',
      patientId: 'pat-profile-2',
      doctorId: 'doc-profile-2',
      departmentId: 'dept-neuro',
      appointmentDate: today,
      timeSlot: '10:00 - 10:30',
      status: 'Confirmed',
      reasonForVisit: 'Frequent throbbing temporal headaches',
      type: 'Consultation',
      tokenNumber: 1,
      notes: '',
      createdAt: today,
    },
    {
      _id: 'appt-3',
      patientId: 'pat-profile-3',
      doctorId: 'doc-profile-4',
      departmentId: 'dept-ortho',
      appointmentDate: tomorrow,
      timeSlot: '11:00 - 11:30',
      status: 'Confirmed',
      reasonForVisit: 'Right knee pain following marathon workout',
      type: 'Routine Checkup',
      tokenNumber: 2,
      notes: '',
      createdAt: today,
    },
  ];

  const medicalRecords = [
    {
      _id: 'med-1',
      appointmentId: 'appt-1',
      patientId: 'pat-profile-1',
      doctorId: 'doc-profile-1',
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
      followUpDate: new Date(now.getTime() + 30 * 86400000).toISOString(),
      createdAt: yesterday,
    },
  ];

  const billing = [
    {
      _id: 'bill-1',
      patientId: 'pat-profile-1',
      appointmentId: 'appt-1',
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
      createdAt: yesterday,
    },
    {
      _id: 'bill-2',
      patientId: 'pat-profile-2',
      appointmentId: 'appt-2',
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
      createdAt: today,
    },
  ];

  return {
    users,
    departments,
    doctors,
    patients,
    appointments,
    medicalRecords,
    billing,
  };
};

// Database persistence helpers
export const loadDatabase = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[LocalDatabase] Failed to read localStorage, initializing clean copy:', err);
    const initial = getInitialSeedData();
    return initial;
  }
};

export const saveDatabase = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('[LocalDatabase] Failed to save DB to localStorage:', err);
  }
};

// Population utilities
const populateDoctor = (doctor, db) => {
  if (!doctor) return null;
  const user = db.users.find((u) => u._id === (doctor.userId?._id || doctor.userId)) || {};
  const dept = db.departments.find((d) => d._id === (doctor.departmentId?._id || doctor.departmentId)) || {};
  return {
    ...doctor,
    userId: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      isActive: user.isActive,
    },
    departmentId: {
      _id: dept._id,
      name: dept.name,
      icon: dept.icon,
      description: dept.description,
    },
  };
};

const populatePatient = (patient, db) => {
  if (!patient) return null;
  const user = db.users.find((u) => u._id === (patient.userId?._id || patient.userId)) || {};
  return {
    ...patient,
    userId: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  };
};

const populateAppointment = (appt, db) => {
  if (!appt) return null;
  const patient = db.patients.find((p) => p._id === (appt.patientId?._id || appt.patientId));
  const doctor = db.doctors.find((d) => d._id === (appt.doctorId?._id || appt.doctorId));
  const dept = db.departments.find((d) => d._id === (appt.departmentId?._id || appt.departmentId));

  return {
    ...appt,
    patientId: populatePatient(patient, db),
    doctorId: populateDoctor(doctor, db),
    departmentId: dept
      ? {
          _id: dept._id,
          name: dept.name,
          icon: dept.icon,
        }
      : null,
  };
};

const populateMedicalRecord = (record, db) => {
  if (!record) return null;
  const patient = db.patients.find((p) => p._id === (record.patientId?._id || record.patientId));
  const doctor = db.doctors.find((d) => d._id === (record.doctorId?._id || record.doctorId));

  return {
    ...record,
    patientId: populatePatient(patient, db),
    doctorId: populateDoctor(doctor, db),
  };
};

const populateBilling = (bill, db) => {
  if (!bill) return null;
  const patient = db.patients.find((p) => p._id === (bill.patientId?._id || bill.patientId));
  return {
    ...bill,
    patientId: populatePatient(patient, db),
  };
};

// Current Session Helper
const getCurrentUser = (db) => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return db.users.find((u) => u._id === (parsed._id || parsed.id)) || parsed;
  } catch {
    return null;
  }
};

const getUserProfile = (user, db) => {
  if (!user) return null;
  if (user.role === 'patient') {
    const pat = db.patients.find((p) => p.userId === user._id || p.userId?._id === user._id);
    return pat ? populatePatient(pat, db) : null;
  }
  if (user.role === 'doctor') {
    const doc = db.doctors.find((d) => d.userId === user._id || d.userId?._id === user._id);
    return doc ? populateDoctor(doc, db) : null;
  }
  return null;
};

// URL parser
const parseUrl = (rawUrl) => {
  let clean = rawUrl.replace(/^\/api/, '');
  if (!clean.startsWith('/')) clean = '/' + clean;

  const [path, queryString] = clean.split('?');
  const query = {};
  if (queryString) {
    const params = new URLSearchParams(queryString);
    for (const [k, v] of params.entries()) {
      query[k] = v;
    }
  }
  return { path, query };
};

// Autonomous Request Handler
export const handleLocalRequest = async (config) => {
  const method = (config.method || 'GET').toUpperCase();
  const { path, query } = parseUrl(config.url);
  const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

  const db = loadDatabase();
  const currentUser = getCurrentUser(db);

  console.log(`[LocalDatabase API] ${method} ${path}`, { query, data });

  // 1. AUTH ROUTES
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = data;
    const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user || user.password !== password) {
      const err = new Error('Invalid email or password');
      err.response = { status: 401, data: { success: false, message: 'Invalid email or password' } };
      throw err;
    }

    if (user.isActive === false) {
      const err = new Error('Your account has been deactivated. Contact administration.');
      err.response = { status: 403, data: { success: false, message: 'Your account has been deactivated.' } };
      throw err;
    }

    const profile = getUserProfile(user, db);
    const token = `offline-jwt-token-${user._id}-${Date.now()}`;

    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
        profile,
      },
    };
  }

  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password, phone, role, dateOfBirth, gender, bloodGroup } = data;
    if (!name || !email || !password) {
      const err = new Error('Please provide name, email, and password.');
      err.response = { status: 400, data: { success: false, message: 'Please provide name, email, and password.' } };
      throw err;
    }

    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      const err = new Error('An account with this email already exists.');
      err.response = { status: 400, data: { success: false, message: 'An account with this email already exists.' } };
      throw err;
    }

    const assignedRole = role && ['patient', 'doctor', 'staff', 'admin'].includes(role) ? role : 'patient';
    const newUserId = `user-${Date.now()}`;
    const newUser = {
      _id: newUserId,
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: assignedRole,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);

    let profile = null;
    if (assignedRole === 'patient') {
      const newPatient = {
        _id: `pat-${Date.now()}`,
        userId: newUserId,
        dateOfBirth: dateOfBirth || '1995-01-01T00:00:00.000Z',
        gender: gender || 'Other',
        bloodGroup: bloodGroup || 'Unknown',
        address: {},
        emergencyContact: {},
        allergies: [],
        createdAt: new Date().toISOString(),
      };
      db.patients.push(newPatient);
      profile = populatePatient(newPatient, db);
    }

    saveDatabase(db);

    const token = `offline-jwt-token-${newUserId}-${Date.now()}`;
    return {
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: newUser._id,
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatar: newUser.avatar,
        },
        profile,
      },
    };
  }

  if (path === '/auth/me' && method === 'GET') {
    if (!currentUser) {
      const err = new Error('Unauthorized');
      err.response = { status: 401, data: { success: false, message: 'Unauthorized' } };
      throw err;
    }
    const profile = getUserProfile(currentUser, db);
    return {
      success: true,
      data: {
        user: {
          id: currentUser._id,
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          phone: currentUser.phone,
          avatar: currentUser.avatar,
        },
        profile,
      },
    };
  }

  if (path === '/auth/profile' && method === 'PUT') {
    if (!currentUser) throw new Error('Unauthorized');
    const { name, phone, avatar } = data;
    const userIndex = db.users.findIndex((u) => u._id === currentUser._id);
    if (userIndex !== -1) {
      if (name) db.users[userIndex].name = name;
      if (phone !== undefined) db.users[userIndex].phone = phone;
      if (avatar !== undefined) db.users[userIndex].avatar = avatar;
      saveDatabase(db);
    }
    return {
      success: true,
      data: { user: db.users[userIndex] },
    };
  }

  // 2. ANALYTICS
  if (path === '/analytics/overview' && method === 'GET') {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = db.appointments.filter((a) => a.appointmentDate?.startsWith(todayStr)).length;
    const completedAppointments = db.appointments.filter((a) => a.status === 'Completed').length;
    const pendingAppointments = db.appointments.filter((a) => a.status === 'Pending' || a.status === 'Confirmed').length;
    const cancelledAppointments = db.appointments.filter((a) => a.status === 'Cancelled').length;

    const totalRevenue = db.billing.reduce((acc, b) => acc + (b.paidAmount || 0), 0);
    const totalInvoiced = db.billing.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    const deptDistribution = db.departments.map((dept) => ({
      name: dept.name,
      doctorCount: db.doctors.filter((d) => d.departmentId === dept._id).length,
    }));

    const recentAppointments = db.appointments
      .slice(-5)
      .reverse()
      .map((a) => populateAppointment(a, db));

    return {
      success: true,
      message: 'Analytics retrieved',
      data: {
        counts: {
          patients: db.patients.length,
          doctors: db.doctors.length,
          staff: db.users.filter((u) => u.role === 'staff').length,
          departments: db.departments.length,
          todayAppointments,
          totalAppointments: db.appointments.length,
          completedAppointments,
          pendingAppointments,
          cancelledAppointments,
        },
        financials: {
          totalRevenue,
          totalInvoiced,
          pendingCollection: Math.max(0, totalInvoiced - totalRevenue),
        },
        deptDistribution,
        recentAppointments,
      },
    };
  }

  // 3. DEPARTMENTS
  if (path === '/departments' && method === 'GET') {
    const depts = db.departments
      .filter((d) => d.isActive !== false)
      .map((dept) => {
        const docCount = db.doctors.filter((doc) => doc.departmentId === dept._id).length;
        const head = dept.headDoctor ? populateDoctor(db.doctors.find((d) => d._id === dept.headDoctor), db) : null;
        return {
          ...dept,
          doctorCount: docCount,
          headDoctor: head,
        };
      });
    return { success: true, data: depts };
  }

  if (path.match(/^\/departments\/[^/]+$/) && method === 'GET') {
    const id = path.split('/')[2];
    const dept = db.departments.find((d) => d._id === id);
    if (!dept) {
      const err = new Error('Department not found');
      err.response = { status: 404, data: { success: false, message: 'Department not found' } };
      throw err;
    }
    const docs = db.doctors.filter((d) => d.departmentId === id).map((d) => populateDoctor(d, db));
    return {
      success: true,
      data: {
        department: dept,
        doctors: docs,
      },
    };
  }

  if (path === '/departments' && method === 'POST') {
    const newDept = {
      _id: `dept-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      icon: data.icon || 'Activity',
      image: data.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500',
      isActive: true,
      headDoctor: null,
    };
    db.departments.push(newDept);
    saveDatabase(db);
    return { success: true, message: 'Department created', data: newDept };
  }

  if (path.match(/^\/departments\/[^/]+$/) && method === 'DELETE') {
    const id = path.split('/')[2];
    db.departments = db.departments.filter((d) => d._id !== id);
    saveDatabase(db);
    return { success: true, message: 'Department removed' };
  }

  // 4. DOCTORS
  if (path === '/doctors' && method === 'GET') {
    let list = db.doctors.map((d) => populateDoctor(d, db));
    if (query.departmentId) {
      list = list.filter((d) => d.departmentId?._id === query.departmentId || d.departmentId === query.departmentId);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.userId?.name?.toLowerCase().includes(s) ||
          d.specialization?.toLowerCase().includes(s) ||
          d.bio?.toLowerCase().includes(s)
      );
    }
    const limit = parseInt(query.limit) || 50;
    const total = list.length;
    const paginated = list.slice(0, limit);

    return {
      success: true,
      data: paginated,
      meta: {
        total,
        page: 1,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  if (path.match(/^\/doctors\/[^/]+\/availability$/) && method === 'GET') {
    const docId = path.split('/')[2];
    const doc = db.doctors.find((d) => d._id === docId);
    if (!doc) {
      const err = new Error('Doctor not found');
      err.response = { status: 404, data: { success: false, message: 'Doctor not found' } };
      throw err;
    }

    if (!query.date) {
      return {
        success: true,
        data: {
          availableDays: doc.availableDays,
          timeSlots: doc.timeSlots,
        },
      };
    }

    const dateStr = query.date.split('T')[0];
    const dayOfWeek = new Date(query.date).toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableDay = doc.availableDays.includes(dayOfWeek);

    const bookedSlots = db.appointments
      .filter((a) => a.doctorId === docId && a.appointmentDate?.startsWith(dateStr) && a.status !== 'Cancelled')
      .map((a) => a.timeSlot);

    const availableSlots = isAvailableDay ? doc.timeSlots.filter((slot) => !bookedSlots.includes(slot)) : [];

    return {
      success: true,
      data: {
        date: query.date,
        dayOfWeek,
        isAvailableDay,
        bookedSlots,
        availableSlots,
        allSlots: doc.timeSlots,
      },
    };
  }

  if (path.match(/^\/doctors\/[^/]+$/) && method === 'GET') {
    const docId = path.split('/')[2];
    const doc = db.doctors.find((d) => d._id === docId);
    if (!doc) {
      const err = new Error('Doctor not found');
      err.response = { status: 404, data: { success: false, message: 'Doctor not found' } };
      throw err;
    }
    return { success: true, data: populateDoctor(doc, db) };
  }

  if (path.match(/^\/doctors\/[^/]+$/) && method === 'PUT') {
    const docId = path.split('/')[2];
    const index = db.doctors.findIndex((d) => d._id === docId);
    if (index !== -1) {
      db.doctors[index] = { ...db.doctors[index], ...data };
      saveDatabase(db);
      return { success: true, data: populateDoctor(db.doctors[index], db) };
    }
    throw new Error('Doctor not found');
  }

  // 5. PATIENTS
  if (path === '/patients' && method === 'GET') {
    let list = db.patients.map((p) => populatePatient(p, db));
    if (query.bloodGroup) {
      list = list.filter((p) => p.bloodGroup === query.bloodGroup);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.userId?.name?.toLowerCase().includes(s) ||
          p.userId?.email?.toLowerCase().includes(s) ||
          p.userId?.phone?.toLowerCase().includes(s)
      );
    }
    const limit = parseInt(query.limit) || 50;
    const total = list.length;
    const paginated = list.slice(0, limit);

    return {
      success: true,
      data: paginated,
      meta: {
        total,
        page: 1,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  if (path.match(/^\/patients\/[^/]+\/history$/) && method === 'GET') {
    const patId = path.split('/')[2];
    const patient = db.patients.find((p) => p._id === patId);
    if (!patient) {
      const err = new Error('Patient not found');
      err.response = { status: 404, data: { success: false, message: 'Patient not found' } };
      throw err;
    }
    const appts = db.appointments
      .filter((a) => a.patientId === patId)
      .map((a) => populateAppointment(a, db));
    const records = db.medicalRecords
      .filter((m) => m.patientId === patId)
      .map((m) => populateMedicalRecord(m, db));

    return {
      success: true,
      data: {
        patient: populatePatient(patient, db),
        appointments: appts,
        records,
      },
    };
  }

  if (path.match(/^\/patients\/[^/]+$/) && method === 'GET') {
    const patId = path.split('/')[2];
    const patient = db.patients.find((p) => p._id === patId);
    if (!patient) throw new Error('Patient not found');
    return { success: true, data: populatePatient(patient, db) };
  }

  if (path === '/patients' && method === 'POST') {
    const { name, email, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact, allergies } = data;
    const newUserId = `user-pat-${Date.now()}`;
    const newUser = {
      _id: newUserId,
      name,
      email: email.toLowerCase(),
      password: 'Patient@123',
      phone: phone || '',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);

    const newPatient = {
      _id: `pat-${Date.now()}`,
      userId: newUserId,
      dateOfBirth: dateOfBirth || '1995-01-01T00:00:00.000Z',
      gender: gender || 'Other',
      bloodGroup: bloodGroup || 'Unknown',
      address: address || {},
      emergencyContact: emergencyContact || {},
      allergies: allergies || [],
      createdAt: new Date().toISOString(),
    };
    db.patients.push(newPatient);
    saveDatabase(db);

    return {
      success: true,
      message: 'Patient registered successfully',
      data: populatePatient(newPatient, db),
    };
  }

  if (path.match(/^\/patients\/[^/]+$/) && method === 'PUT') {
    const patId = path.split('/')[2];
    const index = db.patients.findIndex((p) => p._id === patId);
    if (index !== -1) {
      db.patients[index] = { ...db.patients[index], ...data };
      saveDatabase(db);
      return { success: true, data: populatePatient(db.patients[index], db) };
    }
    throw new Error('Patient not found');
  }

  // 6. APPOINTMENTS
  if (path === '/appointments' && method === 'GET') {
    let list = [...db.appointments];

    if (currentUser?.role === 'patient') {
      const pat = db.patients.find((p) => p.userId === currentUser._id || p.userId?._id === currentUser._id);
      if (pat) list = list.filter((a) => a.patientId === pat._id);
    } else if (currentUser?.role === 'doctor') {
      const doc = db.doctors.find((d) => d.userId === currentUser._id || d.userId?._id === currentUser._id);
      if (doc) list = list.filter((a) => a.doctorId === doc._id);
    }

    if (query.status) {
      list = list.filter((a) => a.status === query.status);
    }
    if (query.doctorId) {
      list = list.filter((a) => a.doctorId === query.doctorId);
    }
    if (query.patientId) {
      list = list.filter((a) => a.patientId === query.patientId);
    }
    if (query.date) {
      const targetDate = query.date.split('T')[0];
      list = list.filter((a) => a.appointmentDate?.startsWith(targetDate));
    }

    list.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    const limit = parseInt(query.limit) || 50;
    const paginated = list.slice(0, limit).map((a) => populateAppointment(a, db));

    return {
      success: true,
      data: paginated,
      meta: {
        total: list.length,
        limit,
      },
    };
  }

  if (path === '/appointments' && method === 'POST') {
    let patientId = data.patientId;
    if (currentUser?.role === 'patient') {
      const pat = db.patients.find((p) => p.userId === currentUser._id || p.userId?._id === currentUser._id);
      if (pat) patientId = pat._id;
    }

    const doc = db.doctors.find((d) => d._id === data.doctorId);
    const departmentId = data.departmentId || doc?.departmentId || 'dept-general';

    const countToday = db.appointments.filter(
      (a) => a.doctorId === data.doctorId && a.appointmentDate?.startsWith((data.appointmentDate || '').split('T')[0])
    ).length;

    const newAppt = {
      _id: `appt-${Date.now()}`,
      patientId,
      doctorId: data.doctorId,
      departmentId,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      status: 'Confirmed',
      reasonForVisit: data.reasonForVisit,
      type: data.type || 'Consultation',
      tokenNumber: countToday + 1,
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };

    db.appointments.unshift(newAppt);
    saveDatabase(db);

    return {
      success: true,
      message: 'Appointment booked successfully',
      data: populateAppointment(newAppt, db),
    };
  }

  if (path.match(/^\/appointments\/[^/]+\/status$/) && method === 'PATCH') {
    const apptId = path.split('/')[2];
    const index = db.appointments.findIndex((a) => a._id === apptId);
    if (index !== -1) {
      db.appointments[index].status = data.status;
      saveDatabase(db);
      return { success: true, data: populateAppointment(db.appointments[index], db) };
    }
    throw new Error('Appointment not found');
  }

  // 7. MEDICAL RECORDS
  if (path === '/medical-records' && method === 'GET') {
    let list = [...db.medicalRecords];
    if (currentUser?.role === 'patient') {
      const pat = db.patients.find((p) => p.userId === currentUser._id || p.userId?._id === currentUser._id);
      if (pat) list = list.filter((m) => m.patientId === pat._id);
    } else if (currentUser?.role === 'doctor') {
      const doc = db.doctors.find((d) => d.userId === currentUser._id || d.userId?._id === currentUser._id);
      if (doc) list = list.filter((m) => m.doctorId === doc._id);
    }
    if (query.patientId) {
      list = list.filter((m) => m.patientId === query.patientId);
    }

    const limit = parseInt(query.limit) || 50;
    const populated = list.slice(0, limit).map((m) => populateMedicalRecord(m, db));
    return { success: true, data: populated };
  }

  if (path === '/medical-records' && method === 'POST') {
    let doctorId = data.doctorId;
    if (currentUser?.role === 'doctor') {
      const doc = db.doctors.find((d) => d.userId === currentUser._id || d.userId?._id === currentUser._id);
      if (doc) doctorId = doc._id;
    }

    const newRecord = {
      _id: `med-${Date.now()}`,
      appointmentId: data.appointmentId || null,
      patientId: data.patientId,
      doctorId,
      diagnosis: data.diagnosis,
      symptoms: data.symptoms || [],
      prescriptions: data.prescriptions || [],
      labTests: data.labTests || [],
      vitals: data.vitals || {},
      notes: data.notes || '',
      followUpDate: data.followUpDate || null,
      createdAt: new Date().toISOString(),
    };

    if (data.appointmentId) {
      const apptIdx = db.appointments.findIndex((a) => a._id === data.appointmentId);
      if (apptIdx !== -1) {
        db.appointments[apptIdx].status = 'Completed';
        db.appointments[apptIdx].notes = `EMR filed. Diagnosis: ${data.diagnosis}`;
      }
    }

    db.medicalRecords.unshift(newRecord);
    saveDatabase(db);

    return {
      success: true,
      message: 'Medical record created',
      data: populateMedicalRecord(newRecord, db),
    };
  }

  // 8. BILLING
  if (path === '/billing' && method === 'GET') {
    let list = [...db.billing];
    if (currentUser?.role === 'patient') {
      const pat = db.patients.find((p) => p.userId === currentUser._id || p.userId?._id === currentUser._id);
      if (pat) list = list.filter((b) => b.patientId === pat._id);
    }
    if (query.status) {
      list = list.filter((b) => b.paymentStatus === query.status);
    }
    const limit = parseInt(query.limit) || 50;
    const total = list.length;
    const paginated = list.slice(0, limit).map((b) => populateBilling(b, db));

    return {
      success: true,
      data: paginated,
      meta: {
        total,
        page: 1,
        limit,
      },
    };
  }

  if (path === '/billing' && method === 'POST') {
    const { patientId, appointmentId, items, tax = 0, discount = 0, paymentMethod } = data;
    const subtotal = (items || []).reduce((acc, item) => acc + item.amount * (item.quantity || 1), 0);
    const totalAmount = Math.max(0, subtotal + Number(tax) - Number(discount));
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(db.billing.length + 1).padStart(5, '0')}`;

    const newInvoice = {
      _id: `bill-${Date.now()}`,
      patientId,
      appointmentId: appointmentId || null,
      invoiceNumber,
      items: items || [],
      subtotal,
      tax,
      discount,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'Pending',
      paymentMethod: paymentMethod || 'None',
      createdAt: new Date().toISOString(),
    };

    db.billing.unshift(newInvoice);
    saveDatabase(db);

    return {
      success: true,
      message: 'Invoice created',
      data: populateBilling(newInvoice, db),
    };
  }

  if (path.match(/^\/billing\/[^/]+\/payment$/) && method === 'PATCH') {
    const billId = path.split('/')[2];
    const index = db.billing.findIndex((b) => b._id === billId);
    if (index !== -1) {
      const b = db.billing[index];
      const paid = data.paidAmount !== undefined ? Number(data.paidAmount) : b.totalAmount;
      b.paidAmount = paid;
      b.paymentMethod = data.paymentMethod || b.paymentMethod;
      b.paymentStatus = paid >= b.totalAmount ? 'Paid' : 'Partially Paid';
      saveDatabase(db);
      return { success: true, data: populateBilling(b, db) };
    }
    throw new Error('Invoice not found');
  }

  // 9. USERS (ADMIN)
  if (path === '/users' && method === 'GET') {
    let list = [...db.users];
    if (query.role) {
      list = list.filter((u) => u.role === query.role);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.phone?.toLowerCase().includes(s)
      );
    }
    const limit = parseInt(query.limit) || 50;
    const total = list.length;
    const paginated = list.slice(0, limit).map((u) => {
      const { password, ...safe } = u;
      return safe;
    });

    return {
      success: true,
      data: paginated,
      meta: {
        total,
        page: 1,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  if (path === '/users' && method === 'POST') {
    const { name, email, password, role, phone, departmentId, specialization, consultationFee } = data;
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      const err = new Error('User with this email already exists');
      err.response = { status: 400, data: { success: false, message: 'User with this email already exists' } };
      throw err;
    }

    const newUserId = `user-${Date.now()}`;
    const newUser = {
      _id: newUserId,
      name,
      email: email.toLowerCase(),
      password: password || 'Hospital@123',
      role: role || 'staff',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);

    if (role === 'doctor') {
      const newDoc = {
        _id: `doc-${Date.now()}`,
        userId: newUserId,
        departmentId: departmentId || 'dept-general',
        specialization: specialization || 'General Practitioner',
        qualifications: ['MBBS'],
        experienceYears: 5,
        consultationFee: consultationFee || 80,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['09:00 - 09:30', '10:00 - 10:30', '11:00 - 11:30', '14:00 - 14:30'],
        roomNumber: 'OPD-101',
        bio: `${name} is an active clinical practitioner.`,
      };
      db.doctors.push(newDoc);
    } else if (role === 'patient') {
      const newPat = {
        _id: `pat-${Date.now()}`,
        userId: newUserId,
        dateOfBirth: '1995-01-01T00:00:00.000Z',
        gender: 'Other',
        bloodGroup: 'Unknown',
        address: {},
        emergencyContact: {},
        allergies: [],
        createdAt: new Date().toISOString(),
      };
      db.patients.push(newPat);
    }

    saveDatabase(db);
    return { success: true, message: 'User created successfully', data: newUser };
  }

  if (path.match(/^\/users\/[^/]+\/status$/) && method === 'PATCH') {
    const userId = path.split('/')[2];
    const index = db.users.findIndex((u) => u._id === userId);
    if (index !== -1) {
      db.users[index].isActive = !db.users[index].isActive;
      saveDatabase(db);
      return { success: true, message: 'Status updated', data: db.users[index] };
    }
    throw new Error('User not found');
  }

  // Fallback for any unknown route
  console.warn(`[LocalDatabase] Unhandled route: ${method} ${path}`);
  return { success: true, data: [] };
};

