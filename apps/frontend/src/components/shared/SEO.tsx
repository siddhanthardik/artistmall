import React from 'react';
import { CONTACT_INFO } from '../../utils/constants';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage = 'https://www.theartistmall.com/og-default.jpg',
  ogType = 'website',
  noIndex = false,
}) => {
  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to upsert <meta> tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:site_name', 'The Artist Mall', true);
    if (canonical) setMeta('og:url', canonical, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Structured Data (JSON-LD)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "The Artist Mall",
      "image": "https://www.theartistmall.com/logo.png",
      "@id": "https://www.theartistmall.com",
      "url": "https://www.theartistmall.com",
      "telephone": `+91-${CONTACT_INFO.PHONE}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "A-208, DWARKA SECTOR-28",
        "addressLocality": "NEW DELHI",
        "postalCode": "110077",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.5450,
        "longitude": 77.0650
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "sameAs": [
        CONTACT_INFO.SOCIAL.FACEBOOK,
        CONTACT_INFO.SOCIAL.INSTAGRAM,
        CONTACT_INFO.SOCIAL.LINKEDIN
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaData);

  }, [title, description, canonical, ogImage, ogType, noIndex]);

  return null;
};
