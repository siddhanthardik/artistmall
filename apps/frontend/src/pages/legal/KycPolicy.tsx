import React from 'react';
import { LegalPage } from './LegalPage';

export const KycPolicy: React.FC = () => (
  <LegalPage
    title="KYC Policy"
    seoTitle="KYC Policy | The Artist Mall — Know Your Customer Verification"
    seoDescription="The Artist Mall's KYC policy for company verification, artist profile approval, and identity document requirements."
    canonical="https://www.theartistmall.com/kyc-policy"
    effectiveDate="1 April 2026"
    lastUpdated="25 April 2026"
    sections={[
      { id: 'why', title: '1. Why We Verify', content: <p>The Artist Mall operates a trust-first B2B marketplace. Our KYC (Know Your Customer) process ensures that every company and artist on the platform is legitimate, legally registered, and accountable. KYC verification protects both Booking Companies (who commit significant budgets) and Management Companies and artists (who commit their time and reputation).</p> },
      { id: 'company-kyc', title: '2. Company KYC Requirements', content: <><p>All registering companies must submit the following documents for verification:</p><ul className="list-disc list-inside space-y-2 mt-3 text-slate-400"><li>Certificate of Incorporation (for Pvt. Ltd / LLP) or Partnership Deed / GST Certificate (for partnerships/proprietorships)</li><li>GST Registration Certificate (mandatory)</li><li>PAN Card of the company</li><li>Aadhaar / PAN of the authorized signatory</li><li>Bank account details for commission payment and receipt</li><li>Active business email address on company domain</li></ul></> },
      { id: 'artist-kyc', title: '3. Artist Profile Verification', content: <><p>Management Companies submitting artist profiles must provide:</p><ul className="list-disc list-inside space-y-2 mt-3 text-slate-400"><li>Artist's full legal name and identity document (Aadhaar / Passport)</li><li>Management authority letter or contract excerpt (confirming the company represents this artist)</li><li>Minimum 3 media assets (photos, performance clips) for profile</li><li>Price range confirmation signed off by the management company</li><li>Category and city tagging must be accurate</li></ul></> },
      { id: 'verification-sla', title: '4. Verification Timeline', content: <><p>Our standard KYC review SLAs:</p><table className="w-full mt-3 text-sm"><thead><tr className="text-left border-b border-slate-700"><th className="pb-2 text-slate-300">Application Type</th><th className="pb-2 text-slate-300">Standard SLA</th><th className="pb-2 text-slate-300">Enterprise SLA</th></tr></thead><tbody className="text-slate-400"><tr className="border-b border-slate-800"><td className="py-2">Company Registration</td><td>3–5 business days</td><td>24 hours</td></tr><tr><td className="py-2">Artist Profile</td><td>2–4 business days</td><td>24 hours</td></tr></tbody></table></> },
      { id: 'rejection', title: '5. KYC Rejection & Appeals', content: <p>If your KYC application is rejected, you will receive a notification with the specific reason. Common reasons include mismatched documents, expired certificates, or incomplete information. You may re-submit corrected documents within 7 days. If you believe a rejection was made in error, email <a href="mailto:kyc@theartistmall.com" className="text-gold-400">kyc@theartistmall.com</a> with your application reference number.</p> },
      { id: 'ongoing', title: '6. Ongoing Compliance', content: <p>KYC verification is not a one-time event. We may request updated documents if: (a) your GST registration is renewed or changed, (b) your authorized signatory changes, (c) we detect anomalies in your platform activity, or (d) there is a significant gap in account activity (12+ months). Failure to provide updated documents may result in temporary account suspension until verification is renewed.</p> },
    ]}
  />
);
