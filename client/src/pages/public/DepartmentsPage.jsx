import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Stethoscope, Users, HeartPulse, Brain, Baby, Bone, Activity } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        if (res.success) setDepartments(res.data);
      } catch (err) {
        console.error('Failed to load departments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const getDeptIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'cardiology':
        return <HeartPulse className="w-8 h-8 text-rose-500" />;
      case 'neurology':
        return <Brain className="w-8 h-8 text-purple-500" />;
      case 'pediatrics':
        return <Baby className="w-8 h-8 text-amber-500" />;
      case 'orthopedics':
        return <Bone className="w-8 h-8 text-blue-500" />;
      default:
        return <Activity className="w-8 h-8 text-brand-sky" />;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading departments directory..." />;
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">Clinical Divisions</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Specialized Medical Care</h1>
        <p className="mt-3 text-sm text-slate-500">
          Our integrated clinical departments combine cutting-edge medical technology with experienced healthcare practitioners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                {getDeptIcon(dept.name)}
              </div>

              <h3 className="text-xl font-bold text-slate-900">{dept.name}</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">{dept.description}</p>

              {dept.headDoctor && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center space-x-3">
                  <img
                    src={
                      dept.headDoctor.userId?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(dept.headDoctor.userId?.name || 'Head Doctor')}&background=2323FF&color=fff`
                    }
                    alt={dept.headDoctor.userId?.name}
                    className="w-10 h-10 rounded-full object-cover border border-teal-200"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Department Head</span>
                    <span className="text-xs font-bold text-slate-800">{dept.headDoctor.userId?.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-blue" />
                {dept.doctorCount || 1} Registered Doctors
              </span>
              <Link
                to={`/doctors?department=${dept._id}`}
                className="text-xs font-bold text-brand-blue hover:text-brand-blue hover:underline"
              >
                View Specialists →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;

