import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Activity,
  ShieldCheck,
  Building2,
  Ambulance,
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Inquiries',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'General Inquiries',
        subject: '',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sky/20/80 text-teal-800 text-xs font-bold tracking-wide uppercase mb-3">
            <Building2 className="w-4 h-4 text-brand-blue" />
            24/7 Hospital Desk & Patient Support
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch With Aegis Health
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Have questions regarding specialist appointments, admissions, insurance claims, or emergency services? Our medical concierge team is ready to assist.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: 24/7 Emergency */}
          <div className="bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-rose-600/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white mb-4">
                <Ambulance className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-rose-200">Critical Response</span>
              <h3 className="text-2xl font-black mt-1">24/7 Emergency ER</h3>
              <p className="text-xs text-rose-100 mt-2 leading-relaxed">
                Direct dispatch to emergency trauma department and ambulance services.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-rose-500/50">
              <a
                href="tel:80091123447"
                className="text-lg font-black tracking-tight hover:underline flex items-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                +1 (800) 911-AEGIS
              </a>
              <span className="text-[11px] text-rose-200 block mt-0.5">Ambulance dispatch in &lt; 8 mins</span>
            </div>
          </div>

          {/* Card 2: General Appointments */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-sky/10 text-brand-blue flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-brand-blue">Patient Helpline</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Appointments & OPD</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Connect with our front desk for physician scheduling, lab test updates, and consultation inquiries.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-base font-bold text-slate-900">+1 (555) 019-2831</p>
              <p className="text-xs text-brand-blue font-semibold mt-0.5">care@aegishealth.org</p>
            </div>
          </div>

          {/* Card 3: Location & Hours */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-600">Hospital Campus</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Visit Our Hospital</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                4500 Healthcare Blvd, Medical District, Springfield, IL 62704
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Clock className="w-4 h-4 text-brand-blue" />
                OPD: Mon - Sat (8:00 AM - 8:00 PM)
              </p>
              <p className="text-[11px] text-slate-400">Emergency & Trauma Center: 24/7 Open</p>
            </div>
          </div>
        </div>

        {/* Contact Form & Hospital Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Send an Inquiry or Feedback</h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below. Our clinical communications officer will respond within 2-4 business hours.
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Thank you for reaching out!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your inquiry has been routed to our patient desk. We will get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relevant Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue bg-white"
                  >
                    <option value="General Inquiries">General Inquiries</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Billing & Insurance">Billing & Insurance Desk</option>
                    <option value="Medical Records">Medical Records (EMR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Question regarding cardiology appointment"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide any details about your question, symptoms, or requested date..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-blue hover:bg-brand-sky text-white font-bold text-xs shadow-md shadow-brand-blue/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Transmitting Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* FAQ & Hospital Standards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800">How do I book an urgent appointment?</p>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    You can either self-register online via our Patient Portal or call our front desk directly at +1 (555) 019-2831.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800">What health insurance plans are accepted?</p>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    We accept major providers including Blue Cross Blue Shield, Aetna, UnitedHealthcare, Medicare, and private health plans.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800">How can I access my digital prescriptions?</p>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    Log in to your Patient Portal with your credentials and visit the "Prescriptions" tab to view or print your official Rx vouchers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-brand-sky font-bold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                Patient Privacy & HIPAA Compliance
              </div>
              <p className="text-slate-300 leading-relaxed">
                All patient inquiries, medical history records, and communication records are encrypted following strict HIPAA healthcare compliance guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

