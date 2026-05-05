import React from 'react';
import { LegalPage } from './LegalPage';

export const ArtistAgreement: React.FC = () => (
  <LegalPage
    title="Artist Partnership Agreement"
    seoTitle="Artist Agreement | The Artist Mall — Artist & Management Company Terms"
    seoDescription="The Artist Mall's agreement governing artist listings, management company responsibilities, and platform representation terms."
    canonical="https://www.theartistmall.com/artist-agreement"
    effectiveDate="1 April 2026"
    lastUpdated="25 April 2026"
    sections={[
      { id: 'parties', title: '1. Parties to This Agreement', content: <p>This Agreement is between The Artist Mall (operated by Nirala Entertainment Pvt. Ltd.) and the Management Company registering on the platform. Management Companies represent artists and are solely responsible for ensuring they have the legal right to list and represent each artist on the platform. This Agreement does not create a direct contractual relationship between The Artist Mall and individual artists.</p> },
      { id: 'listing', title: '2. Artist Listing Standards', content: <><p>Management Companies agree that all artist profiles submitted for approval:</p><ul className="list-disc list-inside space-y-2 mt-3 text-slate-400"><li>Accurately represent the artist's current availability, capabilities, and pricing</li><li>Contain only media files that are legally owned or licensed for use</li><li>Do not misrepresent the artist's credentials, past performances, or ratings</li><li>Are promptly updated if any material information changes</li><li>Comply with all applicable Indian laws regarding entertainment and artist services</li></ul></> },
      { id: 'platform-listing', title: '3. Multi-Platform Listing', content: <p>The Artist Mall does not require sole representation. Artists may be listed on other platforms simultaneously. However, any booking inquiry received through The Artist Mall must be processed through the platform's Deal Room. Circumventing the platform for bookings originating from our marketplace is a material breach of these Terms.</p> },
      { id: 'commission', title: '4. Commission Obligations', content: <p>Management Companies acknowledge that confirmed bookings originating from The Artist Mall carry a 10% platform commission. This commission is payable by the Booking Company. Management Companies agree not to inflate their listed pricing to offset or circumvent this commission structure, as this undermines platform trust and booking conversion rates.</p> },
      { id: 'response-sla', title: '5. Inquiry Response SLA', content: <p>Management Companies registered on The Platform must respond to all booking inquiries within 3 business days. Persistent failure to respond (3+ unanswered inquiries within 30 days) may result in reduced profile visibility or temporary suspension. We understand that not every inquiry may be suitable — a polite decline is preferred over non-response.</p> },
      { id: 'content-rights', title: '6. Content Rights', content: <p>By submitting media content (photos, videos, bios) to the Platform, the Management Company grants The Artist Mall a limited, royalty-free license to display this content on the Platform and in marketing materials (e.g., social media, email campaigns) promoting the artist or the Platform. This license persists as long as the artist profile is active.</p> },
      { id: 'termination', title: '7. Artist Profile Removal', content: <p>Management Companies may request removal of an artist profile at any time by contacting support. Profiles cannot be removed mid-negotiation or if there are any CONFIRMED bookings with pending event execution. The Artist Mall reserves the right to remove profiles that violate community standards, contain inappropriate content, or where the management company fails to maintain KYC compliance.</p> },
    ]}
  />
);
