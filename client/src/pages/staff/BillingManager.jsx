import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BillingManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Create Invoice Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [items, setItems] = useState([
    { description: 'Physician Consultation Fee', amount: 80, quantity: 1 },
  ]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const url = `/billing?${statusFilter ? `status=${statusFilter}&` : ''}limit=50`;
      const res = await api.get(url);
      if (res.success) setInvoices(res.data);
    } catch (err) {
      console.error('Failed to load invoices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients?limit=100');
        if (res.success && res.data.length > 0) {
          setPatients(res.data);
          setPatientId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load patients for billing', err);
      }
    };
    fetchPatients();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: 50, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + (Number(item.amount) || 0) * (Number(item.quantity) || 1), 0);
  };

  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() + Number(tax) - Number(discount));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!patientId || items.length === 0) return;
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/billing', {
        patientId,
        items,
        tax: Number(tax),
        discount: Number(discount),
        paymentMethod,
      });

      if (res.success) {
        setIsModalOpen(false);
        setMessage({ type: 'success', text: `Invoice ${res.data.invoiceNumber} created!` });
        fetchInvoices();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Error generating invoice',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCollectPayment = async (invoiceId, totalAmount) => {
    const method = window.prompt('Enter payment method (Cash, Credit Card, Insurance, Online):', 'Cash');
    if (!method) return;

    try {
      const res = await api.patch(`/billing/${invoiceId}/payment`, {
        paymentStatus: 'Paid',
        paidAmount: totalAmount,
        paymentMethod: method,
      });

      if (res.success) {
        setInvoices(invoices.map((inv) => (inv._id === invoiceId ? res.data : inv)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Hospital Cashier & Billing</h2>
          <p className="text-xs text-slate-500 mt-1">Generate itemized patient invoices, collect cashier payments, and manage balances.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Generate New Invoice
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2">
        {['', 'Pending', 'Paid', 'Partially Paid'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === st
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st === '' ? 'All Invoices' : st}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading invoices ledger..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">
                      No invoices recorded.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-teal-600">{inv.invoiceNumber}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{inv.patientId?.userId?.name}</p>
                        <p className="text-[11px] text-slate-400">{inv.patientId?.userId?.phone || '—'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${inv.totalAmount}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        ${inv.paidAmount}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={inv.paymentStatus}>{inv.paymentStatus}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{inv.paymentMethod}</td>
                      <td className="py-3.5 px-4 text-right">
                        {inv.paymentStatus !== 'Paid' && (
                          <button
                            onClick={() => handleCollectPayment(inv._id, inv.totalAmount)}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors shadow-sm"
                          >
                            Collect ${inv.totalAmount - inv.paidAmount}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Patient Billing Invoice"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.userId?.name} ({p.gender}, Phone: {p.userId?.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">Itemized Charges</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  required
                  placeholder="Service description (e.g. ECG Test)"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200"
                />
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="Price ($)"
                  value={item.amount}
                  onChange={(e) => handleItemChange(idx, 'amount', Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-xl border border-slate-200"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tax ($)</label>
              <input
                type="number"
                min={0}
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount ($)</label>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Insurance">Insurance</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-600">Total Invoice Amount:</span>
            <span className="text-xl font-extrabold text-teal-600">${calculateTotal()}</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 disabled:opacity-50"
            >
              {submitting ? 'Generating...' : 'Issue Invoice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BillingManager;

