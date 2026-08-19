import type { QuotesClasses } from '../types';

export interface QuotesProps {
  verse?: string;
  reference?: string;
  classes?: QuotesClasses;
}

export default function Quotes({ verse, reference, classes = {} }: QuotesProps) {
  return (
    <section className={`relative text-center overflow-hidden p-2 ${classes.container || ''}`}>
      <div className={`max-w-3xl mx-auto border border-white rounded-2xl py-8 px-2 fade-up ${classes.card || ''}`}>
        <h2 className={`text-sm text-shadow-black leading-relaxed text-white fade-up delay-1 ${classes.verse || ''}`}>
          {verse || 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).'}
        </h2>
        <p className={`font-bold text-sm italic text-white fade-up delay-2 ${classes.reference || ''}`}>
          {reference || 'Adz-Dzariyat · Ayat 49'}
        </p>
      </div>
    </section>
  );
}
