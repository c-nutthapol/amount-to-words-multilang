export type SupportedLocale = 'en' | 'th' | 'fr' | 'ja' | 'de' | 'et' | 'es' | 'fa' | 'zh';

// Supported ISO currency codes (extendable)
export type SupportedCurrency = 'USD' | 'EUR' | 'THB' | 'JPY' | 'GBP' | 'CNY';

export interface LocaleConverter {
  convert(amount: number, options?: ConversionOptions): string;
}

export interface ConversionOptions {
  locale?: SupportedLocale;
  // Currency selection (e.g., 'THB')
  currency?: SupportedCurrency;
  // Override number of decimal places for minor unit (e.g., 0 for JPY)
  minorDigits?: number;
  // Simple unit overrides (used by locales that don’t need plural forms)
  majorUnit?: string;
  minorUnit?: string;
  // Rich unit overrides with singular/plural forms for locales that need them
  unitsOverride?: {
    majorSingular: string;
    majorPlural: string;
    minorSingular: string;
    minorPlural: string;
  };
  // Whether to show minor part when it is exactly zero
  showMinorIfZero?: boolean;
}
