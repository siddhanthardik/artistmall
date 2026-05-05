import nodemailer from 'nodemailer';
import { LeadModel, ILead } from './models/lead.model';
import { AppError } from '../../core/errors';

export const LeadService = {
  createLead: async (data: Partial<ILead>) => {
    // Lead Deduplication (same phone + artist within 10 mins)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existingLead = await LeadModel.findOne({
      phone: data.phone,
      artistId: data.artistId,
      createdAt: { $gte: tenMinutesAgo },
    });

    if (existingLead) {
      throw new AppError(
        'A booking request for this artist was recently sent from this phone number. Please wait before trying again.',
        429,
      );
    }

    // Auto Tagging
    const tags = data.tags || [];
    if (data.guestCount && data.guestCount > 1000) {
      if (!tags.includes('High Value')) {
        tags.push('High Value');
      }
    }

    const lead = await LeadModel.create({
      ...data,
      tags,
      status: 'new',
    });

    // Send email asynchronously so it doesn't block response
    LeadService.sendLeadEmail(lead).catch((err) => {
      console.error('Failed to send lead email:', err);
    });

    return lead;
  },

  sendLeadEmail: async (lead: ILead) => {
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!pass) {
      console.warn('GMAIL_APP_PASSWORD not set in environment. Email not sent.');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'salestheartistmall@gmail.com',
        pass: pass,
      },
    });

    await transporter.sendMail({
      from: `"Artist Mall" <salestheartistmall@gmail.com>`,
      to: 'salestheartistmall@gmail.com',
      subject: `🔥 New Booking Lead - ${lead.artistName}`,
      html: `
        <h2>New Booking Enquiry</h2>
        <p><b>Artist:</b> ${lead.artistName}</p>
        <p><b>Name:</b> ${lead.customerName}</p>
        <p><b>Phone:</b> ${lead.phone}</p>
        <p><b>Email:</b> ${lead.email || 'N/A'}</p>
        <p><b>Event:</b> ${lead.eventType}</p>
        <p><b>Date:</b> ${lead.eventDate ? new Date(lead.eventDate).toDateString() : 'N/A'}</p>
        <p><b>City:</b> ${lead.eventCity}</p>
        <p><b>Guests:</b> ${lead.guestCount}</p>
        <p><b>Notes:</b> ${lead.message || 'N/A'}</p>
      `,
    });
  },

  getLeads: async (filters: any) => {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.tag) query.tags = filters.tag;
    if (filters.today) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: startOfDay };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;

    const leads = await LeadModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await LeadModel.countDocuments(query);

    return { leads, total };
  },

  updateLeadStatus: async (id: string, status: string) => {
    const lead = await LeadModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!lead) throw new AppError('Lead not found', 404);
    return lead;
  },

  deleteLead: async (id: string) => {
    const lead = await LeadModel.findByIdAndDelete(id);
    if (!lead) throw new AppError('Lead not found', 404);
    return lead;
  },
};
