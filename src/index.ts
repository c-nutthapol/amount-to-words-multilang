import { enConverter } from './locales/en';
import { thConverter } from './locales/th';
import { frConverter } from './locales/fr';
import { jaConverter } from './locales/ja';
import { deConverter } from './locales/de';
import { SupportedLocale, ConversionOptions } from './types';

const converters = {
  en: enConverter,
  th: thConverter,
  fr: frConverter,
  ja: jaConverter,
  de: deConverter,
} as const;

export function amountToWords(amount: number, locale?: SupportedLocale): string;
export function amountToWords(amount: number, options: ConversionOptions): string;
export function amountToWords(
  amount: number,
  localeOrOptions: SupportedLocale | ConversionOptions = 'en'
): string {
  // Validate amount input
  if (typeof amount !== 'number') {
    throw new Error('Amount must be a number');
  }

  // Determine locale and options
  const locale = typeof localeOrOptions === 'string'
    ? localeOrOptions
    : localeOrOptions.locale ?? 'en';

  const converter = converters[locale];
  if (!converter) {
    throw new Error(`Unsupported locale: ${locale}. Supported locales: ${Object.keys(converters).join(', ')}`);
  }

  try {
    return converter.convert(amount);
  } catch (error) {
    throw new Error(`Failed to convert amount for locale '${locale}': ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Export locales for direct access
export { enConverter, thConverter, frConverter, jaConverter, deConverter };
export * from './types';
