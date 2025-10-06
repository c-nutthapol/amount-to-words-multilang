import { enConverter } from './locales/en';
import { thConverter } from './locales/th';
import { frConverter } from './locales/fr';
import { jaConverter } from './locales/ja';
import { deConverter } from './locales/de';
import { EstonianConverter } from './locales/et';
import { SpanishConverter } from './locales/es';
import { PersianConverter } from './locales/fa';
import { zhConverter } from './locales/zh';
import { SupportedLocale, ConversionOptions } from './types';
import { getMinorDigitsForCurrency, resolveUnitsFor } from './currencies';

const etConverter = new EstonianConverter();
const esConverter = new SpanishConverter();
const faConverter = new PersianConverter();

const converters = {
  en: enConverter,
  th: thConverter,
  fr: frConverter,
  ja: jaConverter,
  de: deConverter,
  et: etConverter,
  es: esConverter,
  fa: faConverter,
  zh: zhConverter,
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

  // Resolve currency-related options
  const options: ConversionOptions | undefined =
    typeof localeOrOptions === 'object' ? { ...localeOrOptions } : undefined;

  if (options) {
    // Fill minorDigits from currency if not provided
    if (options.minorDigits == null && options.currency) {
      const fromCurrency = getMinorDigitsForCurrency(options.currency);
      if (fromCurrency != null) options.minorDigits = fromCurrency;
    }
    // Resolve localized units when currency specified and not overridden
    if (!options.unitsOverride && options.currency) {
      const units = resolveUnitsFor(locale, options.currency);
      if (units) options.unitsOverride = units;
    }
  }

  try {
    return converter.convert(amount, options);
  } catch (error) {
    throw new Error(`Failed to convert amount for locale '${locale}': ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Export locales for direct access
export { enConverter, thConverter, frConverter, jaConverter, deConverter, etConverter, esConverter, faConverter, zhConverter };
export * from './types';
