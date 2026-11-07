import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Stethoscope, Calendar, DollarSign, Clock, MapPin, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDepartment = searchParams.get('department') || '';
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMetaAndDoctors = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get(`/doctors?${selectedDepartment ? `departmentId=${selectedDepartment}&` : ''}${searchTerm ? `search=${searchTerm}&` : ''}`),
        ]);
        if (deptRes.success) setDepartments(deptRes.data);
        if (docRes.success) setDoctors(docRes.data);
      } catch (err) {
        console.error('Failed to load doctors list', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetaAndDoctors();
  }, [selectedDepartment, searchTerm]);

  const handleDeptChange = (deptId) => {
    if (deptId) {
      setSearchParams({ department: deptId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Medical Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">Our Medical Specialists</h1>
        <p className="mt-3 text-sm text-slate-500">
          Search qualified doctors by name, specialty, or department and view their active schedules.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-7 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by doctor name or specialty..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="sm:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDepartment}
            onChange={(e) => handleDeptChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 text-slate-700 bg-white"
          >
            <option value="">All Clinical Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <LoadingSpinner text="Finding available doctors..." />
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No doctors found</h3>
          <p className="text-xs text-slate-400 mt-1">Try refining your search term or clearing the department filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      doc.userId?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.userId?.name || 'Doctor')}&background=0d9488&color=fff`
                    }
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.userId?.name || 'Doctor')}&background=0d9488&color=fff`;
                    }}
                    alt={doc.userId?.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm"
                  />
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md mb-1">
                      {doc.departmentId?.name || 'Specialist'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{doc.userId?.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Room: {doc.roomNumber || 'OPD-101'}
                    </p>
                  </div>
                </div>

                {doc.bio && (
                  <p className="mt-4 text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{doc.bio}"
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-teal-600" /> Experience
                    </span>
                    <span className="font-bold text-slate-800">{doc.experienceYears} Years</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <DollarSign className="w-3.5 h-3.5 text-teal-600" /> Consultation Fee
                    </span>
                    <span className="font-bold text-teal-600 text-sm">${doc.consultationFee}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Available Days:</span>
                  <div className="flex flex-wrap gap-1">
                    {doc.availableDays?.map((day) => (
                      <span key={day} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Link
                  to="/patient/book"
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Book Consultation Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;

