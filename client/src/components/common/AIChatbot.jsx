import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  Calendar,
  FileText,
  Pill,
  Stethoscope,
  Phone,
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EMERGENCY_KEYWORDS = [
  'severe pain',
  'chest pain',
  'difficulty breathing',
  'short of breath',
  'shortness of breath',
  'heavy bleeding',
  'bleeding',
  'heart attack',
  'stroke',
  'unconscious',
  'loss of consciousness',
  'fainted',
  'fainting',
  'choking',
  'overdose',
  'poison',
  'suicide',
  'seizure',
  'critical emergency',
  'emergency',
  'dying',
];

const SYMPTOM_KEYWORDS = [
  'headache',
  'fever',
  'cough',
  'cold',
  'flu',
  'nausea',
  'vomit',
  'vomiting',
  'dizziness',
  'dizzy',
  'stomach ache',
  'abdominal pain',
  'back pain',
  'knee pain',
  'joint pain',
  'rash',
  'swelling',
  'sore throat',
  'fatigue',
  'tired',
  'diarrhea',
  'infection',
  'symptom',
  'symptoms',
  'hurts',
  'pain',
];

const QUICK_PROMPTS = [
  { label: '📅 Book Appointment', query: 'How do I book an appointment?' },
  { label: '📋 Medical Records', query: 'Where can I find my medical records?' },
  { label: '💊 Prescriptions', query: 'How do I view my prescriptions?' },
  { label: '🩺 Find a Doctor', query: 'How can I find a doctor?' },
  { label: '📞 Contact Hospital', query: 'How do I contact the hospital?' },
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const initialGreeting = user?.name
    ? `Hello ${user.name}! I am your Hospital Administrative Assistant. How can I assist you with our hospital portal today?`
    : `Hello! I am your Hospital Administrative Assistant. How can I help you navigate our healthcare portal today?`;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const generateResponse = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. EMERGENCY CHECK (Highest Priority)
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => q.includes(kw));
    if (isEmergency) {
      return {
        text: `🚨 **CRITICAL MEDICAL EMERGENCY WARNING:**\n\nIf you or someone nearby is experiencing severe pain, difficulty breathing, chest pain, heavy bleeding, loss of consciousness, or any life-threatening condition, **please immediately call 911 (or your local emergency services) or go to the nearest hospital emergency room.**\n\n*I am an administrative assistant and cannot assist with urgent medical emergencies.*`,
        isEmergency: true,
        actions: [{ label: 'Call 911 Immediately', url: 'tel:911', external: true }],
      };
    }

    // 2. SYMPTOMS / MEDICAL ADVICE REQUEST CHECK
    const isSymptom = SYMPTOM_KEYWORDS.some((kw) => q.includes(kw));
    if (isSymptom && !q.includes('book') && !q.includes('appointment')) {
      return {
        text: `I am very sorry to hear that you are not feeling well.\n\n⚠️ **Medical Disclaimer:** I am an administrative assistant, **not a medical doctor**. I cannot provide medical advice, evaluate symptoms, diagnose conditions, or recommend medications.\n\nTo have your symptoms professionally assessed, please book a consultation with one of our clinical specialists:`,
        actions: [
          { label: 'Book Specialist Consultation', path: user ? '/patient/book' : '/login' },
          { label: 'Browse Doctors Directory', path: '/doctors' },
        ],
      };
    }

    // 3. BOOKING APPOINTMENTS
    if (
      q.includes('book') ||
      q.includes('schedule') ||
      q.includes('appointment') ||
      q.includes('consultation') ||
      q.includes('reserve slot')
    ) {
      return {
        text: `To book an appointment through our portal, please follow these steps:\n\n* **Step 1:** Go to the **"Book Appointment"** tab.\n* **Step 2:** Select a Department (*Cardiology, Neurology, Pediatrics, Orthopedics, or General Medicine*).\n* **Step 3:** Choose your preferred specialist.\n* **Step 4:** Pick an open date and available time slot, then enter your reason for visit.\n\nYour appointment and queue token number will be generated immediately.`,
        actions: [
          { label: 'Open Booking Wizard', path: user ? '/patient/book' : '/login' },
          { label: 'View Available Specialists', path: '/doctors' },
        ],
      };
    }

    // 4. MEDICAL RECORDS (EMR)
    if (
      q.includes('record') ||
      q.includes('emr') ||
      q.includes('history') ||
      q.includes('timeline') ||
      q.includes('vitals') ||
      q.includes('visit')
    ) {
      return {
        text: `You can access your complete health file under the **"Medical Records"** tab:\n\n* **Clinical Visits Timeline:** Chronological record of past doctor consultations.\n* **Vitals & Diagnosis:** Blood pressure, heart rate, temperature, and diagnosis notes.\n* **Lab Orders:** Ordered laboratory diagnostic tests.\n* **Demographics:** Emergency contact and insurance policy information.`,
        actions: [{ label: 'View Medical Records', path: user ? '/patient/history' : '/login' }],
      };
    }

    // 5. PRESCRIPTIONS
    if (
      q.includes('prescription') ||
      q.includes('medicine') ||
      q.includes('medication') ||
      q.includes('drug') ||
      q.includes('rx') ||
      q.includes('dosage')
    ) {
      return {
        text: `You can view and print all authorized prescriptions under the **"Prescriptions"** tab:\n\n* View prescribed medications, exact dosages, and daily frequencies.\n* Review doctor instructions and treatment durations.\n* Generate a printable PDF / formal clinic prescription slip.`,
        actions: [{ label: 'View My Prescriptions', path: user ? '/patient/prescriptions' : '/login' }],
      };
    }

    // 6. FINDING DOCTORS
    if (
      q.includes('doctor') ||
      q.includes('specialist') ||
      q.includes('physician') ||
      q.includes('cardiologist') ||
      q.includes('neurologist') ||
      q.includes('pediatrician') ||
      q.includes('surgeon')
    ) {
      return {
        text: `You can search and filter our hospital's certified physicians via the **"Find Doctors"** directory:\n\n* Search by specialist name or medical specialty.\n* Filter by clinical department (*Cardiology, Neurology, Pediatrics, Orthopedics, etc.*).\n* View qualifications, years of experience, consulting schedule, and room numbers.`,
        actions: [{ label: 'Search Doctors Directory', path: '/doctors' }],
      };
    }

    // 7. DEPARTMENTS
    if (q.includes('department') || q.includes('clinic') || q.includes('service') || q.includes('specialt')) {
      return {
        text: `Our hospital features 5 specialized clinical departments:\n\n* **Cardiology:** Advanced cardiovascular diagnostics and heart health.\n* **Neurology:** Neurological disorders and brain healthcare.\n* **Pediatrics:** Comprehensive infant, child, and adolescent care.\n* **Orthopedics:** Musculoskeletal, joint replacement, and sports medicine.\n* **General Medicine:** Preventive consultations and family healthcare.`,
        actions: [{ label: 'Explore Departments', path: '/departments' }],
      };
    }

    // 8. BILLING / INSURANCE / HOSPITAL POLICIES
    if (
      q.includes('bill') ||
      q.includes('invoice') ||
      q.includes('cost') ||
      q.includes('price') ||
      q.includes('fee') ||
      q.includes('insurance') ||
      q.includes('payment')
    ) {
      return {
        text: `For specific questions regarding hospital billing, itemized invoices, insurance coverage, or cashier collections, please contact our administrative desk directly through our **"Contact Us"** page or visit the hospital reception desk.`,
        actions: [{ label: 'Go to Contact Us Page', path: '/contact' }],
      };
    }

    // 9. GENERAL CONTACT / HOURS
    if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('address') || q.includes('location')) {
      return {
        text: `You can contact our hospital administrative desk anytime:\n\n* **Phone:** +1 (555) 019-2831\n* **Email:** support@hospital.com\n* **Location:** 742 Evergreen Medical Plaza, Healthcare District\n* **Hours:** OPD Desk open Mon–Sat: 8:00 AM – 8:00 PM (Emergency Room open 24/7)`,
        actions: [{ label: 'Open Contact Us Page', path: '/contact' }],
      };
    }

    // 10. DEFAULT HELPFUL FALLBACK
    return {
      text: `I am here to guide you through the Hospital Management System portal.\n\nHere are the main services I can help you with:\n* **Book Appointment:** Schedule a consultation with an available specialist.\n* **Medical Records (EMR):** Review your past clinical visits and vitals.\n* **Prescriptions:** Access your digital medication slips.\n* **Find Doctors:** Search our physician directory by specialty.\n\nPlease choose one of the options below or ask me a specific question!`,
      actions: [
        { label: 'Book Appointment', path: user ? '/patient/book' : '/login' },
        { label: 'Find Doctors', path: '/doctors' },
        { label: 'Contact Help Desk', path: '/contact' },
      ],
    };
  };

  const handleSend = (queryToSend) => {
    const textToSend = queryToSend || input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse.text,
          actions: botResponse.actions,
          isEmergency: botResponse.isEmergency,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action) => {
    if (action.external && action.url) {
      window.location.href = action.url;
      return;
    }
    if (action.path) {
      navigate(action.path);
      // Optional: keep chat open or close on mobile
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-teal-700/40 hover:shadow-teal-700/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          aria-label="Open Hospital AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-extrabold tracking-wide uppercase text-teal-100">Need Help?</p>
            <p className="text-sm font-bold -mt-0.5">HMS Assistant</p>
          </div>
          <Sparkles className="w-4 h-4 text-teal-200 opacity-80 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/25 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-200 shadow-inner">
                <Bot className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">HMS Assistant</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/80">Administrative & Patient Guidance</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart Conversation"
                className="p-1.5 rounded-xl hover:bg-white/10 text-teal-200 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-xl hover:bg-white/10 text-teal-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 shadow-xs transition-colors shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-slate-700 text-white'
                        : m.isEmergency
                        ? 'bg-rose-600 text-white'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    {isUser ? (
                      <User className="w-4 h-4" />
                    ) : m.isEmergency ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div className={`max-w-[82%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-teal-600 text-white rounded-tr-xs shadow-sm font-medium'
                          : m.isEmergency
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {m.text.split('\n').map((line, i) => {
                          if (line.startsWith('* ')) {
                            return (
                              <div key={i} className="flex items-start gap-1.5 my-1 ml-1">
                                <span className="text-teal-600 font-bold">•</span>
                                <span>{renderFormattedText(line.substring(2))}</span>
                              </div>
                            );
                          }
                          return (
                            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                              {renderFormattedText(line)}
                            </p>
                          );
                        })}
                      </div>

                      {/* Action Navigation Buttons */}
                      {m.actions && m.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {m.actions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              onClick={() => handleActionClick(act)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all shadow-xs ${
                                act.external
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                  : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 hover:border-teal-300'
                              }`}
                            >
                              <span>{act.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-400 px-1">{m.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about booking, records, doctors..."
                className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-transparent rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all shadow-sm shrink-0"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              Administrative AI • Not medical advice • In emergency dial 911
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility to render bold tags (**text**)
function renderFormattedText(text) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
