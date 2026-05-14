import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  overrides?: Record<string, string>;
  className?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  artists: 'Artists',
  'artist-categories': 'Categories',
  about: 'About Us',
  contact: 'Contact',
  careers: 'Careers',
  faq: 'FAQ',
  'how-it-works': 'How It Works',
  'corporate-solutions': 'Corporate Solutions',
  testimonials: 'Testimonials',
  'why-choose-us': 'Why Choose Us',
  'wedding-entertainment': 'Wedding Entertainment',
  'celebrity-booking': 'Celebrity Booking',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms of Service',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ overrides, className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      // Use override if provided, else check ROUTE_LABELS, else capitalize
      let label = overrides?.[value] || ROUTE_LABELS[value];
      
      if (!label) {
        label = value
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      return { label, path, active: isLast };
    }),
  ];

  return (
    <nav className={`flex items-center gap-2 text-[10px] font-black text-neutral-content/30 uppercase tracking-[0.2em] ${className}`}>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && <ChevronRight className="w-2.5 h-2.5 text-neutral-content/20" />}
          
          {item.active ? (
            <span className="text-brand-primary">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-neutral-content transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
