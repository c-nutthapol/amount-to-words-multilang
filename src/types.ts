export type SupportedLocale = 'en' | 'th' | 'fr' | 'ja' | 'de';

export interface LocaleConverter {
  convert(amount: number): string;
}

export interface ConversionOptions {
  locale?: SupportedLocale;
  majorUnit?: string;
  minorUnit?: string;
  showMinorIfZero?: boolean;
}
