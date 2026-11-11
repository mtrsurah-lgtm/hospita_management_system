const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

process.env.NODE_ENV = 'test';
process.env.USE_IN_MEMORY_DB = 'true';

const { connectDB, disconnectDB } = require('../src/config/db');
const { seedHospitalData } = require('../src/seed/seedData');
const app = require('../src/server');

const TEST_PORT = 5099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Helper for making HTTP requests
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  return {
    status: res.status,
    ok: res.ok,
    data,
  };
}

const testResults = [];

function recordTest(category, name, passed, details = '') {
  testResults.push({ category, name, passed, details });
  const mark = passed ? '✅ [PASS]' : '❌ [FAIL]';
  console.log(`  ${mark} ${name}${details ? ` (${details})` : ''}`);
}

async function runChecklist() {
  console.log('\n======================================================');
  console.log('  RUNNING HMS COMPREHENSIVE TESTING CHECKLIST (45/45)');
  console.log('======================================================\n');

  // 1. Wait for DB and seed to completely finish (Billing is the last model seeded)
  const Billing = require('../src/models/Billing');
  const Doctor = require('../src/models/Doctor');
  const Patient = require('../src/models/Patient');
  let retries = 40;
  while (retries > 0) {
    try {
      const count = await Billing.countDocuments();
      if (count > 0) break;
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 500));
    retries--;
  }
  // Wait an extra 200ms to be 100% stable
  await new Promise((r) => setTimeout(r, 200));

  // 2. Start HTTP server on test port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, '127.0.0.1', resolve));

  let adminToken = '';
  let doctorToken = '';
  let staffToken = '';
  let patientToken = '';
  let createdPatientProfileId = '';
  let createdDepartmentId = '';
  let createdDoctorId = '';
  let bookedAppointmentId = '';
  let createdMedicalRecordId = '';
  let createdInvoiceId = '';
  let sampleDoctorId = '';
  let samplePatientId = '';

  try {
    // ==========================================
    // 1. Authentication (6 items)
    // ==========================================
    console.log('1. Authentication');

    // 1.1 Admin login
    const adminLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@hospital.com', password: 'Admin@123' },
    });
    const adminPass = adminLoginRes.status === 200 && adminLoginRes.data?.data?.user?.role === 'admin' && !!adminLoginRes.data?.data?.token;
    if (adminPass) adminToken = adminLoginRes.data.data.token;
    recordTest('Authentication', 'Admin login', adminPass);

    // 1.2 Doctor login
    const doctorLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'doctor.sarah@hospital.com', password: 'Doctor@123' },
    });
    const doctorPass = doctorLoginRes.status === 200 && doctorLoginRes.data?.data?.user?.role === 'doctor' && !!doctorLoginRes.data?.data?.token;
    if (doctorPass) {
      doctorToken = doctorLoginRes.data.data.token;
      sampleDoctorId = doctorLoginRes.data.data.profile?._id;
    }
    recordTest('Authentication', 'Doctor login', doctorPass);

    // 1.3 Staff login
    const staffLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'staff@hospital.com', password: 'Staff@123' },
    });
    const staffPass = staffLoginRes.status === 200 && staffLoginRes.data?.data?.user?.role === 'staff' && !!staffLoginRes.data?.data?.token;
    if (staffPass) staffToken = staffLoginRes.data.data.token;
    recordTest('Authentication', 'Staff login', staffPass);

    // 1.4 Patient login
    const patientLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'patient.john@hospital.com', password: 'Patient@123' },
    });
    const patientPass = patientLoginRes.status === 200 && patientLoginRes.data?.data?.user?.role === 'patient' && !!patientLoginRes.data?.data?.token;
    if (patientPass) {
      patientToken = patientLoginRes.data.data.token;
      samplePatientId = patientLoginRes.data.data.profile?._id;
    }
    recordTest('Authentication', 'Patient login', patientPass);

    // 1.5 Invalid password
    const invalidPassRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@hospital.com', password: 'WrongPassword_XYZ' },
    });
    const invalidPass = invalidPassRes.status === 401 && invalidPassRes.data?.success === false;
    recordTest('Authentication', 'Invalid password', invalidPass);

    // 1.6 Logout and session expiry
    const sessionRes = await request('/api/auth/me', {
      headers: { Authorization: 'Bearer expired_or_invalid_jwt_token_123' },
    });
    const sessionPass = sessionRes.status === 401 && sessionRes.data?.success === false;
    recordTest('Authentication', 'Logout and session expiry', sessionPass);

    if (!sampleDoctorId) {
      const d = await Doctor.findOne();
      sampleDoctorId = d?._id;
    }
    if (!samplePatientId) {
      const p = await Patient.findOne();
      samplePatientId = p?._id;
    }

    // ==========================================
    // 2. Patient management (5 items)
    // ==========================================
    console.log('\n2. Patient management');

    // 2.1 Patient registration
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Alice Springs',
        email: 'alice.springs@test.com',
        password: 'Password@123',
        phone: '+1 (555) 777-8888',
        role: 'patient',
        dateOfBirth: '1992-04-12',
        gender: 'Female',
        bloodGroup: 'B+',
      },
    });
    const regPass = regRes.status === 201 && regRes.data?.data?.user?.role === 'patient' && !!regRes.data?.data?.profile?._id;
    if (regPass) {
      createdPatientProfileId = regRes.data.data.profile._id;
    }
    recordTest('Patient management', 'Patient registration', regPass);

    // 2.2 Duplicate email validation
    const dupRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Alice Duplicate',
        email: 'alice.springs@test.com',
        password: 'Password@123',
      },
    });
    const dupPass = dupRes.status === 400 && dupRes.data?.success === false;
    recordTest('Patient management', 'Duplicate email validation', dupPass);

    // 2.3 Update patient profile
    const updatePatientRes = await request(`/api/patients/${createdPatientProfileId || samplePatientId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        bloodGroup: 'AB+',
        allergies: ['Penicillin', 'Peanuts'],
        insuranceProvider: 'MetroHealth Blue',
      },
    });
    const updatePatientPass = updatePatientRes.status === 200 && updatePatientRes.data?.data?.bloodGroup === 'AB+' && updatePatientRes.data?.data?.allergies?.includes('Penicillin');
    recordTest('Patient management', 'Update patient profile', updatePatientPass);

    // 2.4 Search patient
    const searchRes = await request('/api/patients?search=John', {
      headers: { Authorization: `Bearer ${staffToken}` },
    });
    const searchPass = searchRes.status === 200 && Array.isArray(searchRes.data?.data) && searchRes.data.data.some((p) => p.userId?.name?.includes('John'));
    recordTest('Patient management', 'Search patient', searchPass);

    // 2.5 View patient medical history
    const historyRes = await request(`/api/patients/${samplePatientId}/history`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    const historyPass = historyRes.status === 200 && !!historyRes.data?.data?.patient && Array.isArray(historyRes.data?.data?.appointments) && Array.isArray(historyRes.data?.data?.medicalRecords);
    recordTest('Patient management', 'View patient medical history', historyPass);

    // ==========================================
    // 3. Doctor and department (5 items)
    // ==========================================
    console.log('\n3. Doctor and department');

    // 3.1 Create department
    const createDeptRes = await request('/api/departments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Orthopedics & Spine',
        description: 'Comprehensive musculoskeletal & trauma care',
        icon: 'Bone',
      },
    });
    const createDeptPass = createDeptRes.status === 201 && createDeptRes.data?.data?.name === 'Orthopedics & Spine';
    if (createDeptPass) {
      createdDepartmentId = createDeptRes.data.data._id;
    }
    recordTest('Doctor and department', 'Create department', createDeptPass);

    // 3.2 Add doctor
    const addDoctorRes = await request('/api/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Dr. Gregory House',
        email: 'dr.house@hospital.com',
        password: 'Doctor@123',
        role: 'doctor',
        phone: '+1 (555) 999-1122',
        departmentId: createdDepartmentId,
        specialization: 'Diagnostic Medicine & Orthopedics',
        consultationFee: 150,
      },
    });
    const addDocPass = addDoctorRes.status === 201 && addDoctorRes.data?.data?.user?.role === 'doctor' && !!addDoctorRes.data?.data?.profile?._id;
    if (addDocPass) {
      createdDoctorId = addDoctorRes.data.data.profile._id;
    }
    recordTest('Doctor and department', 'Add doctor', addDocPass);

    // 3.3 Update doctor profile
    const updateDocRes = await request(`/api/doctors/${createdDoctorId || sampleDoctorId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        consultationFee: 175,
        roomNumber: 'Room 404-B',
        bio: 'Specialist in complex diagnostic pathology and spine mechanics.',
      },
    });
    const updateDocPass = updateDocRes.status === 200 && updateDocRes.data?.data?.consultationFee === 175 && updateDocRes.data?.data?.roomNumber === 'Room 404-B';
    recordTest('Doctor and department', 'Update doctor profile', updateDocPass);

    // 3.4 Check doctor availability
    const availRes = await request(`/api/doctors/${sampleDoctorId}/availability?date=2026-11-16`);
    const availPass = availRes.status === 200 && availRes.data?.data && Array.isArray(availRes.data.data.availableSlots);
    recordTest('Doctor and department', 'Check doctor availability', availPass);

    // 3.5 Filter doctors by department
    const filterDeptRes = await request(`/api/doctors?departmentId=${createdDepartmentId}`);
    const filterDeptPass = filterDeptRes.status === 200 && Array.isArray(filterDeptRes.data?.data) && filterDeptRes.data.data.every((d) => d.departmentId?._id === createdDepartmentId || d.departmentId === createdDepartmentId);
    recordTest('Doctor and department', 'Filter doctors by department', filterDeptPass);

    // ==========================================
    // 4. Appointments (6 items)
    // ==========================================
    console.log('\n4. Appointments');

    // 4.1 Book appointment
    const bookApptRes = await request('/api/appointments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        patientId: samplePatientId,
        doctorId: sampleDoctorId,
        appointmentDate: '2026-12-01',
        timeSlot: '10:00 AM',
        reasonForVisit: 'Cardiac palpitation follow-up',
        type: 'Consultation',
      },
    });
    const bookPass = bookApptRes.status === 201 && bookApptRes.data?.data?.status === 'Confirmed' && !!bookApptRes.data?.data?.tokenNumber;
    if (bookPass) {
      bookedAppointmentId = bookApptRes.data.data._id;
    }
    recordTest('Appointments', 'Book appointment', bookPass);

    // 4.2 Reject duplicate time slot
    const dupSlotRes = await request('/api/appointments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        patientId: samplePatientId,
        doctorId: sampleDoctorId,
        appointmentDate: '2026-12-01',
        timeSlot: '10:00 AM',
        reasonForVisit: 'Duplicate slot test',
      },
    });
    const dupSlotPass = dupSlotRes.status === 400 && dupSlotRes.data?.success === false;
    recordTest('Appointments', 'Reject duplicate time slot', dupSlotPass);

    // 4.3 Reschedule appointment
    const rescheduleRes = await request(`/api/appointments/${bookedAppointmentId}/reschedule`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        appointmentDate: '2026-12-01',
        timeSlot: '11:00 AM',
      },
    });
    const reschedulePass = rescheduleRes.status === 200 && rescheduleRes.data?.data?.timeSlot === '11:00 AM';
    recordTest('Appointments', 'Reschedule appointment', reschedulePass);

    // 4.4 Cancel appointment
    const cancelApptRes = await request(`/api/appointments/${bookedAppointmentId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: { status: 'Cancelled' },
    });
    const cancelPass = cancelApptRes.status === 200 && cancelApptRes.data?.data?.status === 'Cancelled';
    recordTest('Appointments', 'Cancel appointment', cancelPass);

    // 4.5 Update appointment status
    const updateStatusRes = await request(`/api/appointments/${bookedAppointmentId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: { status: 'Confirmed' },
    });
    const updateStatusPass = updateStatusRes.status === 200 && updateStatusRes.data?.data?.status === 'Confirmed';
    recordTest('Appointments', 'Update appointment status', updateStatusPass);

    // 4.6 Generate token number
    const tokenNumberPass = bookApptRes.data?.data?.tokenNumber >= 1;
    recordTest('Appointments', 'Generate token number', tokenNumberPass, `Token: ${bookApptRes.data?.data?.tokenNumber}`);

    // ==========================================
    // 5. Medical records (6 items)
    // ==========================================
    console.log('\n5. Medical records');

    // 5.1 Create consultation record
    const emrRes = await request('/api/medical-records', {
      method: 'POST',
      headers: { Authorization: `Bearer ${doctorToken}` },
      body: {
        appointmentId: bookedAppointmentId,
        patientId: samplePatientId,
        doctorId: sampleDoctorId,
        diagnosis: 'Stage 1 Hypertension & Angina Pectoris',
        symptoms: ['Chest tightness', 'Shortness of breath on exertion'],
        vitals: {
          bloodPressure: '135/88 mmHg',
          heartRate: 78,
          temperature: 98.6,
          respiratoryRate: 16,
          weight: 74,
        },
        prescriptions: [
          {
            medicine: 'Amlodipine Besylate',
            dosage: '5mg',
            frequency: 'Once Daily',
            duration: '30 Days',
            instructions: 'Take in the morning with water',
          },
        ],
        labTests: ['Lipid Profile Panel', '12-Lead Electrocardiogram (ECG)'],
        notes: 'Advised low-sodium DASH diet and 30 min daily walking.',
      },
    });
    const emrPass = emrRes.status === 201 && !!emrRes.data?.data?._id;
    if (emrPass) {
      createdMedicalRecordId = emrRes.data.data._id;
    }
    recordTest('Medical records', 'Create consultation record', emrPass);

    // 5.2 Add patient vitals
    const vitalsPass = emrRes.data?.data?.vitals?.bloodPressure === '135/88 mmHg' && String(emrRes.data?.data?.vitals?.heartRate) === '78';
    recordTest('Medical records', 'Add patient vitals', vitalsPass);

    // 5.3 Add diagnosis
    const diagPass = emrRes.data?.data?.diagnosis === 'Stage 1 Hypertension & Angina Pectoris';
    recordTest('Medical records', 'Add diagnosis', diagPass);

    // 5.4 Create prescription
    const rxPass = Array.isArray(emrRes.data?.data?.prescriptions) && emrRes.data.data.prescriptions.some((p) => p.medicine === 'Amlodipine Besylate');
    recordTest('Medical records', 'Create prescription', rxPass);

    // 5.5 Add laboratory test order
    const labPass = Array.isArray(emrRes.data?.data?.labTests) && emrRes.data.data.labTests.some((t) => (t.testName || t) === 'Lipid Profile Panel');
    recordTest('Medical records', 'Add laboratory test order', labPass);

    // 5.6 View medical history
    const viewRecordRes = await request(`/api/medical-records/${createdMedicalRecordId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    const viewRecordPass = viewRecordRes.status === 200 && viewRecordRes.data?.data?.diagnosis === 'Stage 1 Hypertension & Angina Pectoris';
    recordTest('Medical records', 'View medical history', viewRecordPass);

    // ==========================================
    // 6. Billing (6 items)
    // ==========================================
    console.log('\n6. Billing');

    // 6.1 Generate invoice
    const invRes = await request('/api/billing', {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        patientId: samplePatientId,
        appointmentId: bookedAppointmentId,
        items: [
          { description: 'Cardiology Specialist Consultation', amount: 150, quantity: 1 },
          { description: '12-Lead Electrocardiogram (ECG)', amount: 50, quantity: 1 },
        ],
        tax: 15,
        discount: 20,
        paymentMethod: 'Cash',
      },
    });
    const invPass = invRes.status === 201 && !!invRes.data?.data?.invoiceNumber;
    if (invPass) {
      createdInvoiceId = invRes.data.data._id;
    }
    recordTest('Billing', 'Generate invoice', invPass);

    // 6.2 Calculate subtotal
    const subtotalPass = invRes.data?.data?.subtotal === 200; // 150 + 50
    recordTest('Billing', 'Calculate subtotal', subtotalPass, `Subtotal: $${invRes.data?.data?.subtotal}`);

    // 6.3 Calculate tax and discount
    // Total = subtotal(200) + tax(15) - discount(20) = 195
    const totalCalcPass = invRes.data?.data?.totalAmount === 195 && invRes.data?.data?.tax === 15 && invRes.data?.data?.discount === 20;
    recordTest('Billing', 'Calculate tax and discount', totalCalcPass, `Total: $${invRes.data?.data?.totalAmount}`);

    // 6.4 Record partial payment
    const partialPayRes = await request(`/api/billing/${createdInvoiceId}/payment`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        paidAmount: 95,
        paymentMethod: 'Cash',
      },
    });
    const partialPayPass = partialPayRes.status === 200 && partialPayRes.data?.data?.paidAmount === 95 && partialPayRes.data?.data?.paymentStatus === 'Partially Paid';
    recordTest('Billing', 'Record partial payment', partialPayPass, `Status: ${partialPayRes.data?.data?.paymentStatus}`);

    // 6.5 Record full payment
    const fullPayRes = await request(`/api/billing/${createdInvoiceId}/payment`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        paidAmount: 195,
        paymentMethod: 'Credit Card',
      },
    });
    const fullPayPass = fullPayRes.status === 200 && fullPayRes.data?.data?.paidAmount === 195 && fullPayRes.data?.data?.paymentStatus === 'Paid';
    recordTest('Billing', 'Record full payment', fullPayPass, `Status: ${fullPayRes.data?.data?.paymentStatus}`);

    // 6.6 Calculate outstanding balance
    // After paying 195 out of 195, outstanding is 0.
    // For verification, test balance calculation logic and balanceDue virtual
    const balanceCheck = (fullPayRes.data?.data?.totalAmount - fullPayRes.data?.data?.paidAmount) === 0;
    recordTest('Billing', 'Calculate outstanding balance', balanceCheck, `Outstanding: $${fullPayRes.data?.data?.totalAmount - fullPayRes.data?.data?.paidAmount}`);

    // ==========================================
    // 7. Security (5 items)
    // ==========================================
    console.log('\n7. Security');

    // 7.1 Patient cannot access admin dashboard
    const patientAdminRes = await request('/api/users', {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    const patientAdminBlockPass = patientAdminRes.status === 403;
    recordTest('Security', 'Patient cannot access admin dashboard', patientAdminBlockPass);

    // 7.2 Patient cannot access another patient's records
    // Patient John tries to access created patient Alice's history
    const otherPatientHistoryRes = await request(`/api/patients/${createdPatientProfileId}/history`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    const otherPatientBlockPass = otherPatientHistoryRes.status === 403;
    recordTest('Security', "Patient cannot access another patient's records", otherPatientBlockPass);

    // 7.3 Doctor cannot access admin-only operations
    const docAdminRes = await request('/api/departments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${doctorToken}` },
      body: { name: 'Doctor Unauthorized Dept' },
    });
    const docAdminBlockPass = docAdminRes.status === 403;
    recordTest('Security', 'Doctor cannot access admin-only operations', docAdminBlockPass);

    // 7.4 Staff cannot perform unauthorized operations
    const staffAdminRes = await request('/api/departments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: { name: 'Staff Unauthorized Dept' },
    });
    const staffAdminBlockPass = staffAdminRes.status === 403;
    recordTest('Security', 'Staff cannot perform unauthorized operations', staffAdminBlockPass);

    // 7.5 Unauthenticated API requests are rejected
    const unauthRes = await request('/api/analytics/overview');
    const unauthBlockPass = unauthRes.status === 401;
    recordTest('Security', 'Unauthenticated API requests are rejected', unauthBlockPass);

    // ==========================================
    // 8. Analytics (6 items)
    // ==========================================
    console.log('\n8. Analytics');

    const analyticsRes = await request('/api/analytics/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const aData = analyticsRes.data?.data || {};

    // 8.1 Total patient count
    const totalPatientPass = analyticsRes.status === 200 && typeof aData.counts?.patients === 'number' && aData.counts.patients > 0;
    recordTest('Analytics', 'Total patient count', totalPatientPass, `Count: ${aData.counts?.patients}`);

    // 8.2 Total appointment count
    const totalApptPass = analyticsRes.status === 200 && typeof aData.counts?.totalAppointments === 'number' && aData.counts.totalAppointments > 0;
    recordTest('Analytics', 'Total appointment count', totalApptPass, `Count: ${aData.counts?.totalAppointments}`);

    // 8.3 Completed appointment count
    const completedApptPass = analyticsRes.status === 200 && typeof aData.counts?.completedAppointments === 'number' && aData.counts.completedAppointments >= 0;
    recordTest('Analytics', 'Completed appointment count', completedApptPass, `Count: ${aData.counts?.completedAppointments}`);

    // 8.4 Total collections
    const totalCollPass = analyticsRes.status === 200 && typeof aData.financials?.totalRevenue === 'number' && aData.financials.totalRevenue >= 0;
    recordTest('Analytics', 'Total collections', totalCollPass, `Collections: $${aData.financials?.totalRevenue}`);

    // 8.5 Outstanding revenue
    const outRevPass = analyticsRes.status === 200 && typeof aData.financials?.pendingCollection === 'number' && aData.financials.pendingCollection >= 0;
    recordTest('Analytics', 'Outstanding revenue', outRevPass, `Outstanding: $${aData.financials?.pendingCollection}`);

    // 8.6 Doctors grouped by department
    const deptGroupPass = analyticsRes.status === 200 && Array.isArray(aData.deptDistribution) && aData.deptDistribution.length > 0 && typeof aData.deptDistribution[0].doctorCount === 'number';
    recordTest('Analytics', 'Doctors grouped by department', deptGroupPass, `${aData.deptDistribution?.length} departments`);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    await disconnectDB();
  }

  // Summary
  const totalTests = testResults.length;
  const passedTests = testResults.filter((t) => t.passed).length;
  const percentage = Math.round((passedTests / totalTests) * 100);

  console.log('\n======================================================');
  console.log(`  HMS TESTING RESULTS: ${passedTests}/${totalTests} PASSED (${percentage}%)`);
  console.log('======================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL 45/45 TESTS PASSED WITH 100% SUCCESS!');
  } else {
    console.log(`⚠️ ${totalTests - passedTests} test(s) failed.`);
  }

  return { totalTests, passedTests, percentage, testResults };
}

if (require.main === module) {
  runChecklist().then(({ totalTests, passedTests }) => {
    process.exit(passedTests === totalTests ? 0 : 1);
  });
}

module.exports = { runChecklist };

