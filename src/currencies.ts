import { SupportedCurrency, SupportedLocale } from './types';

export type UnitsSet = {
  majorSingular: string;
  majorPlural: string;
  minorSingular: string;
  minorPlural: string;
};

// ISO 4217 minor digits configuration (simplified common cases)
export const currencyMinorDigits: Record<SupportedCurrency, number> = {
  USD: 2,
  EUR: 2,
  THB: 2,
  JPY: 0,
  GBP: 2,
  CNY: 2,
};

// Localized default unit words per locale and currency
export const currencyUnitsByLocale: Record<SupportedLocale, Partial<Record<SupportedCurrency, UnitsSet>>> = {
  en: {
    USD: { majorSingular: 'dollar', majorPlural: 'dollars', minorSingular: 'cent', minorPlural: 'cents' },
    EUR: { majorSingular: 'euro', majorPlural: 'euros', minorSingular: 'cent', minorPlural: 'cents' },
    GBP: { majorSingular: 'pound', majorPlural: 'pounds', minorSingular: 'penny', minorPlural: 'pence' },
    JPY: { majorSingular: 'yen', majorPlural: 'yen', minorSingular: 'sen', minorPlural: 'sen' },
    THB: { majorSingular: 'baht', majorPlural: 'baht', minorSingular: 'satang', minorPlural: 'satang' },
    CNY: { majorSingular: 'yuan', majorPlural: 'yuan', minorSingular: 'fen', minorPlural: 'fen' },
  },
  th: {
    THB: { majorSingular: 'บาท', majorPlural: 'บาท', minorSingular: 'สตางค์', minorPlural: 'สตางค์' },
    USD: { majorSingular: 'ดอลลาร์', majorPlural: 'ดอลลาร์', minorSingular: 'เซนต์', minorPlural: 'เซนต์' },
    EUR: { majorSingular: 'ยูโร', majorPlural: 'ยูโร', minorSingular: 'เซนต์', minorPlural: 'เซนต์' },
  },
  fr: {
    EUR: { majorSingular: 'euro', majorPlural: 'euros', minorSingular: 'centime', minorPlural: 'centimes' },
    USD: { majorSingular: 'dollar', majorPlural: 'dollars', minorSingular: 'cent', minorPlural: 'cents' },
  },
  de: {
    EUR: { majorSingular: 'Euro', majorPlural: 'Euro', minorSingular: 'Cent', minorPlural: 'Cent' },
  },
  es: {
    EUR: { majorSingular: 'euro', majorPlural: 'euros', minorSingular: 'céntimo', minorPlural: 'céntimos' },
    USD: { majorSingular: 'dólar', majorPlural: 'dólares', minorSingular: 'centavo', minorPlural: 'centavos' },
  },
  fa: {
    EUR: { majorSingular: 'یورو', majorPlural: 'یورو', minorSingular: 'سنت', minorPlural: 'سنت' },
  },
  et: {
    EUR: { majorSingular: 'euro', majorPlural: 'eurot', minorSingular: 'sent', minorPlural: 'senti' },
  },
  zh: {
    CNY: { majorSingular: '元', majorPlural: '元', minorSingular: '分', minorPlural: '分' },
  },
  ja: {
    JPY: { majorSingular: 'えん', majorPlural: 'えん', minorSingular: 'せん', minorPlural: 'せん' },
  },
};

export function getMinorDigitsForCurrency(currency?: SupportedCurrency): number | undefined {
  if (!currency) return undefined;
  return currencyMinorDigits[currency];
}

export function resolveUnitsFor(locale: SupportedLocale, currency?: SupportedCurrency): UnitsSet | undefined {
  if (!currency) return undefined;
  const units = currencyUnitsByLocale[locale]?.[currency];
  return units;
}