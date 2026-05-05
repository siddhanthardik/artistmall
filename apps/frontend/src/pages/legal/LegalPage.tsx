/**
 * LegalPage — Shared layout for all legal/compliance pages.
 * Provides consistent hierarchy, scroll UX, and anchor-able sections.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/shared/SEO';
import { Shield } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: Section[];
}

export const LegalPage: React.FC<LegalPageProps> = ({
  title,
  seoTitle,
  seoDescription,
  canonical,
  effectiveDate,
  lastUpdated,
  sections,
}) => (
  <div className="min-h-screen bg-slate-900">
    <SEO title={seoTitle} description={seoDescription} canonical={canonical} noIndex={false} />

    {/* Header */}
    <section className="pt-32 pb-12 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold-400" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Legal Document
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">{title}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <span>
              Effective Date: <span className="text-slate-300">{effectiveDate}</span>
            </span>
            <span>
              Last Updated: <span className="text-slate-300">{lastUpdated}</span>
            </span>
            <span>
              Governed by: <span className="text-slate-300">Indian Law</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Body */}
    <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
      {/* Sidebar Nav */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24 space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Sections
          </p>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block text-sm text-slate-400 hover:text-gold-400 py-1.5 border-l-2 border-transparent hover:border-gold-500/50 pl-3 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </aside>

      {/* Content */}
      <article className="flex-1 min-w-0">
        <div className="prose prose-invert prose-slate max-w-none">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className={i > 0 ? 'mt-12 pt-12 border-t border-slate-800' : ''}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{s.title}</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">{s.content}</div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
          <p className="text-sm text-slate-400">
            For any legal queries regarding this document, contact us at{' '}
            <a
              href="mailto:legal@theartistmall.com"
              className="text-gold-400 hover:text-gold-300 font-medium"
            >
              legal@theartistmall.com
            </a>
            .
            <br />
            The Artist Mall is operated by Nirala Entertainment Pvt. Ltd., Mumbai, India.
          </p>
        </div>
      </article>
    </div>
  </div>
);
