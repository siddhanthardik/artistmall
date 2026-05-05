/**
 * Queue Service — Async Background Jobs
 *
 * Architecture: BullMQ-compatible job queue pattern using Redis as the broker.
 * Jobs are enqueued by API handlers and processed asynchronously by workers.
 *
 * Job Types:
 *  - SEND_EMAIL        : Transactional emails (approval, rejection, booking)
 *  - PROCESS_COMMISSION: Calculate & record platform commission after booking completes
 *  - SEND_NOTIFICATION : In-app notification dispatch
 *  - SEND_REMINDER     : Stale booking / KYC reminder campaigns
 *  - ADMIN_ALERT       : Critical ops alerts to the admin email
 *
 * To activate in production:
 *   npm install bullmq   (in apps/backend)
 *   Set REDIS_URI in environment variables
 */

export type JobType =
  | 'SEND_EMAIL'
  | 'PROCESS_COMMISSION'
  | 'SEND_NOTIFICATION'
  | 'SEND_REMINDER'
  | 'ADMIN_ALERT';

export interface Job<T = Record<string, unknown>> {
  type: JobType;
  payload: T;
  scheduledAt?: Date;
}

// ── In-Memory Stub (replace with BullMQ in production) ──────────────────────
const jobQueue: Job[] = [];

export const enqueue = async <T>(job: Job<T>): Promise<void> => {
  // In production, replace this stub with:
  // await bullQueue.add(job.type, job.payload, { delay: job.scheduledAt ? ... : 0 });
  jobQueue.push(job as Job);
  console.log(`[Queue] Job enqueued: ${job.type}`);
};

// ── Email Job Helpers ─────────────────────────────────────────────────────────
export const QueueJobs = {
  sendApprovalEmail: (companyEmail: string, artistName: string) =>
    enqueue({
      type: 'SEND_EMAIL',
      payload: { template: 'ARTIST_APPROVED', to: companyEmail, artistName },
    }),

  sendRejectionEmail: (companyEmail: string, artistName: string, reason: string) =>
    enqueue({
      type: 'SEND_EMAIL',
      payload: { template: 'ARTIST_REJECTED', to: companyEmail, artistName, reason },
    }),

  sendBookingUpdate: (to: string, bookingId: string, status: string) =>
    enqueue({ type: 'SEND_EMAIL', payload: { template: 'BOOKING_UPDATE', to, bookingId, status } }),

  processCommission: (bookingId: string, gmvAmount: number) =>
    enqueue({ type: 'PROCESS_COMMISSION', payload: { bookingId, gmvAmount, platformRate: 0.1 } }),

  sendNegotiationReminder: (to: string, bookingId: string, staleDays: number) =>
    enqueue({
      type: 'SEND_REMINDER',
      payload: { template: 'NEGOTIATION_STALE', to, bookingId, staleDays },
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h delay
    }),
};
