import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  HeartHandshake,
  MessageSquare
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Inquiries',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate brief network submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'General Inquiries',
        subject: '',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 mb-3">
            <HeartHandshake className="w-3.5 h-3.5" /> 24/7 Dedicated Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact Our Hospital Team
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about clinical appointments, health records, or billing? Our dedicated patient care specialists and medical staff are here to assist you round the clock.
          </p>
        </div>

        {/* Emergency Alert Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Immediate Medical Emergency?</h3>
              <p className="text-rose-100 text-sm">
                For life-threatening situations, dial our 24/7 Trauma & Emergency Unit directly.
              </p>
            </div>
          </div>
          <a
            href="tel:+18009114677"
            className="px-6 py-3 rounded-xl bg-white text-rose-700 font-bold text-sm hover:bg-rose-50 transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" /> Call +1 (800) 911-HOSP
          </a>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Phone Hotline</h3>
              <p className="text-xs text-slate-500 mt-1">Direct lines for consultations and front desk.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
              <p className="text-xs font-semibold text-slate-800">Main: +1 (555) 019-2834</p>
              <p className="text-xs text-rose-600 font-bold">ER: +1 (800) 911-HOSP</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Email Inquiries</h3>
              <p className="text-xs text-slate-500 mt-1">Fast email response within 2-4 business hours.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
              <p className="text-xs font-semibold text-slate-800">care@hospital.org</p>
              <p className="text-xs text-slate-500">records@hospital.org</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Main Campus</h3>
              <p className="text-xs text-slate-500 mt-1">Multi-specialty hospital complex.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
              <p className="text-xs font-semibold text-slate-800">4500 Healthcare Blvd</p>
              <p className="text-xs text-slate-500">Medical District, Springfield, IL</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Working Hours</h3>
              <p className="text-xs text-slate-500 mt-1">Outpatient & diagnostic timings.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
              <p className="text-xs font-semibold text-slate-800">OPD: Mon - Sat (8am - 8pm)</p>
              <p className="text-xs text-teal-600 font-bold">ER & Labs: 24/7/365 Open</p>
            </div>
          </div>
        </div>

        {/* Form & Map / Campus Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Send Us an Inquiry</h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill in your details below and a hospital representative will get back to you shortly.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Message Dispatched Successfully!</h4>
                  <p className="text-xs mt-0.5 text-teal-700">
                    Thank you for reaching out. Ticket #HOSP-{Math.floor(1000 + Math.random() * 9000)} has been created for your inquiry.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department / Topic
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="General Inquiries">General Inquiries</option>
                    <option value="Appointment Booking">Appointment Booking</option>
                    <option value="Cardiology">Cardiology Department</option>
                    <option value="Neurology">Neurology Department</option>
                    <option value="Pediatrics">Pediatrics Department</option>
                    <option value="Orthopedics">Orthopedics Department</option>
                    <option value="Billing & Insurance">Billing & Insurance</option>
                    <option value="Patient Records (EMR)">Medical Records Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Summary of your question or request"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide details so we can best route your inquiry..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Campus Directions & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Hospital Campus Map</h3>
                  <p className="text-xs text-slate-500">Directions & Parking Amenities</p>
                </div>
              </div>

              <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-center space-y-2">
                <MapPin className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="font-bold text-slate-800 text-sm">Main Campus & Trauma Tower</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Intersection of Healthcare Blvd & Medical District Expressway. Free 24/7 multi-level patient parking available at Tower B.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Wheelchair and handicap accessible entrances at all gates.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>On-site 24/7 licensed pharmacy and diagnostics laboratory.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Strict sanitation and patient safety protocols enforced.</span>
                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-teal-600">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">How do I schedule an appointment?</p>
                  <p className="text-slate-500">
                    You can book online through our Patient Portal after registering, or speak directly with our front desk receptionist at +1 (555) 019-2834.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">How can I obtain my medical records?</p>
                  <p className="text-slate-500">
                    Logged-in patients can download and print digital prescription vouchers and consultation histories instantly from their dashboard.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">Which insurances do you accept?</p>
                  <p className="text-slate-500">
                    We accept all major private health networks, Medicare, and Medicaid. Contact our billing department for pre-authorization assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

