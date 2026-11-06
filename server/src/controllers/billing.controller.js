const Billing = require('../models/Billing');
const Patient = require('../models/Patient');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Create a billing invoice
// @route   POST /api/billing
// @access  Private (Staff, Admin)
const createInvoice = async (req, res, next) => {
  try {
    const { patientId, appointmentId, items, tax = 0, discount = 0, paymentMethod } = req.body;

    if (!patientId || !items || !items.length) {
      return errorResponse(res, 400, 'Patient and at least one billing item are required');
    }

    const subtotal = items.reduce((acc, item) => acc + (item.amount * (item.quantity || 1)), 0);
    const totalAmount = Math.max(0, subtotal + Number(tax) - Number(discount));

    const invoiceCount = await Billing.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`;

    const invoice = await Billing.create({
      patientId,
      appointmentId: appointmentId || null,
      invoiceNumber,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'Pending',
      paymentMethod: paymentMethod || 'None',
    });

    const populated = await Billing.findById(invoice._id).populate({
      path: 'patientId',
      populate: { path: 'userId', select: 'name email phone' },
    });

    return successResponse(res, 201, 'Invoice generated successfully', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all billing invoices (role filtered)
// @route   GET /api/billing
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) {
      filter.paymentStatus = status;
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return successResponse(res, 200, 'No invoices', []);
      filter.patientId = patient._id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Billing.countDocuments(filter);

    const invoices = await Billing.find(filter)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, 'Invoices retrieved', invoices, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice payment status
// @route   PATCH /api/billing/:id/payment
// @access  Private (Staff, Admin)
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paidAmount, paymentMethod } = req.body;
    const invoice = await Billing.findById(req.params.id);

    if (!invoice) {
      return errorResponse(res, 404, 'Invoice not found');
    }

    if (paymentStatus) invoice.paymentStatus = paymentStatus;
    if (paidAmount !== undefined) invoice.paidAmount = paidAmount;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;

    if (invoice.paidAmount >= invoice.totalAmount) {
      invoice.paymentStatus = 'Paid';
    } else if (invoice.paidAmount > 0) {
      invoice.paymentStatus = 'Partially Paid';
    }

    await invoice.save();

    return successResponse(res, 200, 'Invoice payment status updated', invoice);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  updatePaymentStatus,
};

