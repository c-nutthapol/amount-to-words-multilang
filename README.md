# Amount to Words - Multilingual

A TypeScript library for converting numeric amounts to words in multiple languages (English, Thai, French, Japanese, German, Estonian, Spanish, Persian, Chinese). Perfect for financial applications, invoice generation, and internationalization.

## Features

- 🌍 **9 Languages**: English, Thai, French, Japanese, German, Estonian, Spanish, Persian, Chinese
- 💰 **Currency Support**: Handles major currencies with proper fractional units
- ✅ **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🎯 **Zero Dependencies**: Pure TypeScript implementation without external libraries
- 🧪 **Well Tested**: 163+ test cases covering edge cases and language-specific rules
- 📦 **Lightweight**: Minimal bundle size with tree-shaking support

## Installation

```bash
npm install amount-to-words-multilang
```

## Quick Start

```typescript
import { amountToWords } from 'amount-to-words-multilang';

// English (default)
console.log(amountToWords(1234.56));
// "one thousand two hundred thirty-four dollars and fifty-six cents"

// Thai
console.log(amountToWords(1234.56, 'th'));
// "หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์"

// French
console.log(amountToWords(1234.56, 'fr'));
// "mille deux cent trente-quatre euros et cinquante-six centimes"

// Japanese (hiragana output)
console.log(amountToWords(1234.56, 'ja'));
// "せんにひゃくさんじゅうよんえんごじゅうろくせん"

// German
console.log(amountToWords(1234.56, 'de'));
// "eintausend zweihundertvierunddreißig Euro und sechsundfünfzig Cent"

// Estonian
console.log(amountToWords(1234.56, 'et'));
// "tuhat kakssada kolmkümmend neli eurot ja viiskümmend kuus senti"

// Spanish
console.log(amountToWords(1234.56, 'es'));
// "mil doscientos treinta y cuatro euros y cincuenta y seis céntimos"

// Persian
console.log(amountToWords(1234.56, 'fa'));
// "یک هزار و دویست و سی و چهار یورو و پنجاه و شش سنت"

// Chinese
console.log(amountToWords(1234.56, 'zh'));
// "一千二百三十四元五十六分"
```

## Supported Locales

| Locale | Language | Currency | Fractional Unit |
|--------|----------|----------|----------------|
| `en` | English | Dollar | Cents |
| `th` | Thai | Baht | Satang |
| `fr` | French | Euro | Centimes |
| `ja` | Japanese | Yen | Sen |
| `de` | German | Euro | Cent |
| `et` | Estonian | Euro | Senti |
| `es` | Spanish | Euro | Céntimos |
| `fa` | Persian | Euro | Cent |
| `zh` | Chinese | Yuan | Fen |

## API Reference

### `amountToWords(amount, locale?)`

Converts a numeric amount to words in the specified language.

**Parameters:**

- `amount` (number): The numeric amount to convert (must be non-negative and finite)
- `locale` (string, optional): The target locale ('en', 'th', 'fr', 'ja', 'de', 'et', 'es', 'fa', 'zh'). Defaults to 'en'

**Returns:**

- `string`: The amount converted to words

**Throws:**

- `Error`: For invalid inputs (negative numbers, infinity, NaN, unsupported locales)

### Using Individual Converters

You can also import and use converters directly:

```typescript
import {
  enConverter,
  thConverter,
  frConverter,
  jaConverter,
  deConverter,
  etConverter,
  esConverter,
  faConverter,
  zhConverter
} from 'amount-to-words-multilang';

console.log(enConverter.convert(100.50));
console.log(thConverter.convert(100.50));
console.log(frConverter.convert(100.50));
console.log(jaConverter.convert(100.50));
console.log(deConverter.convert(100.50));
console.log(etConverter.convert(100.50));
console.log(esConverter.convert(100.50));
console.log(faConverter.convert(100.50));
console.log(zhConverter.convert(100.50));
```

## Currency Options

This library supports flexible currency handling beyond default locale units. Use `ConversionOptions` to control currency, minor digits, and unit words.

```typescript
import { amountToWords } from 'amount-to-words-multilang';

// English with Thai Baht
amountToWords(123.45, { locale: 'en', currency: 'THB' });
// "one hundred twenty-three baht and forty-five satang"

// Thai with Baht (shows "ถ้วน" when no satang)
amountToWords(123, { locale: 'th', currency: 'THB' });
// "หนึ่งร้อยยี่สิบสามบาทถ้วน"

// English with Japanese Yen (JPY has 0 minor digits)
amountToWords(123.45, { locale: 'en', currency: 'JPY' });
// "one hundred twenty-three yen"

// Japanese with JPY (hiragana output)
amountToWords(123.45, { locale: 'ja', currency: 'JPY' });
// "ひゃくにじゅうさんえん"

// Override units explicitly (any locale)
amountToWords(10.5, {
  locale: 'en',
  unitsOverride: {
    majorSingular: 'credit',
    majorPlural: 'credits',
    minorSingular: 'point',
    minorPlural: 'points',
  },
});
// "ten credits and fifty points"
```

### ConversionOptions

```ts
type ConversionOptions = {
  locale?: 'en' | 'th' | 'fr' | 'ja' | 'de' | 'et' | 'es' | 'fa' | 'zh';
  currency?: 'USD' | 'EUR' | 'THB' | 'JPY' | 'GBP' | 'CNY';
  minorDigits?: number; // overrides currency defaults (e.g. JPY: 0)
  unitsOverride?: {
    majorSingular: string;
    majorPlural: string;
    minorSingular: string;
    minorPlural: string;
  };
  // Thai-specific
  showMinorIfZero?: boolean; // default true, adds "ถ้วน" when no satang
}
```

Default currency minor digits (ISO 4217 common defaults):
- USD: 2, EUR: 2, THB: 2, JPY: 0, GBP: 2, CNY: 2

Unit words are resolved per-locale and per-currency, and can be overridden via `unitsOverride`.

## Language-Specific Features

### English

- Proper singular/plural forms ("one dollar" vs "two dollars")
- Standard American English number formatting
- Handles floating-point precision issues

### Thai (ไทย)

- Uses traditional Thai number system
- Special rules for "เอ็ด" (et) and "ยี่สิบ" (yisip)
- Proper Thai currency formatting with บาท (baht) and สตางค์ (satang)

### French (Français)

- Belgian/Swiss French number system with "septante", "huitante", "nonante"
- Proper use of "et" (and) in compound numbers
- Correct plural forms for "cents" and "centimes"

### Japanese (日本語)

- Traditional Japanese number system with 万 (man) and 億 (oku)
- Special readings for numbers (e.g., 300 = "sanbyaku", 3000 = "sanzen")
- Uses 円 (yen) and 銭 (sen) currency units

### German (Deutsch)

- Compound number formation (ones before tens: "einundzwanzig")
- Proper use of "ein" vs "eins" in different contexts
- Complex compound word formation for large numbers

### Estonian (Eesti)

- Proper singular/plural forms for "euro" and "sent"
- Uses traditional Estonian number system
- Special handling for compound numbers and ordinals

### Spanish (Español)

- Proper gender agreement and plural forms
- Handles millions/billions correctly ("mil millones", "un millón")
- Uses "y" (and) for compound numbers

### Persian (فارسی)

- Right-to-left text formatting
- Uses Persian numerals and traditional number system
- Proper conjunction handling with "و" (va/and)

### Chinese (中文)

- Traditional Chinese number system with 万 (wan) and 億 (yi)
- Proper handling of zero positions with "零"
- Uses 元 (yuan) and 分 (fen) currency units
- Special rules for compound numbers and large numbers

## Examples

### Basic Usage

```typescript
import { amountToWords } from 'amount-to-words-multilang';

// Zero amounts
amountToWords(0, 'en');     // "zero dollars"
amountToWords(0, 'th');     // "ศูนย์บาท"

// Whole numbers
amountToWords(1, 'en');     // "one dollar"
amountToWords(100, 'fr');   // "cent euros"

// Decimals
amountToWords(1.50, 'en');  // "one dollar and fifty cents"
amountToWords(42.99, 'de'); // "zweiundvierzig Euro und neunundneunzig Cent"
amountToWords(99.01, 'et'); // "üheksakümmend üheksa eurot ja üks sent"
amountToWords(75.25, 'es'); // "setenta y cinco euros y veinticinco céntimos"
amountToWords(33.67, 'fa'); // "سی و سه یورو و شصت و هفت سنت"
amountToWords(88.99, 'zh'); // "八十八元九十九分"
```

### Complex Numbers

```typescript
// Large numbers
amountToWords(1000000, 'en');    // "one million dollars"
amountToWords(12345678, 'ja');   // "千二百三十四万五千六百七十八円"
amountToWords(987654321, 'zh');  // "九億八千七百六十五万四千三百二十一元"

// Precision handling
amountToWords(0.1 + 0.2, 'en');  // Handles floating-point precision correctly
```

### Error Handling

```typescript
try {
  amountToWords(-100);              // Throws: "Amount must be non-negative"
  amountToWords(Infinity);          // Throws: "Amount must be finite"
  amountToWords(100, 'invalid');    // Throws: "Unsupported locale"
} catch (error) {
  console.error(error.message);
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:verbose       # Run tests with verbose output
```

### Project Structure

```text
src/
├── index.ts              # Main entry point
├── types.ts              # Type definitions
└── locales/
    ├── en.ts            # English converter
    ├── th.ts            # Thai converter
    ├── fr.ts            # French converter
    ├── ja.ts            # Japanese converter
    ├── de.ts            # German converter
    ├── et.ts            # Estonian converter
    ├── es.ts            # Spanish converter
    ├── fa.ts            # Persian converter
    └── zh.ts            # Chinese converter

tests/
├── main.test.ts         # Integration tests
├── en.test.ts          # English converter tests
├── th.test.ts          # Thai converter tests
├── fr.test.ts          # French converter tests
├── ja.test.ts          # Japanese converter tests
├── de.test.ts          # German converter tests
├── et.test.ts          # Estonian converter tests
├── es.test.ts          # Spanish converter tests
├── fa.test.ts          # Persian converter tests
└── zh.test.ts          # Chinese converter tests
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Adding New Languages

To add support for a new language:

1. Create a new converter in `src/locales/[locale].ts`
2. Implement the `NumberToWordsConverter` interface
3. Add the locale to `SupportedLocale` type in `src/types.ts`
4. Update the converter mapping in `src/index.ts`
5. Add comprehensive tests in `tests/[locale].test.ts`

## License

MIT License - see LICENSE file for details.

## Changelog

### 1.3.0

- Added flexible currency support: `currency`, `minorDigits`, `unitsOverride`
- Centralized currency metadata in `src/currencies.ts` with ISO minor digits
- JPY (0 minor digits) and THB unit words integrated across locales
- English: improved minor-unit rounding (fixes 1.005 → 1.01)
- French: use singular for zero amounts ("zéro euro")
- Updated tests to 167 cases; added currency tests for THB/JPY

### 1.2.0

- Added support for Chinese (zh)
- Traditional Chinese number system with 万 and 億
- Proper zero handling and currency formatting
- Updated to 163+ test cases covering all languages

### 1.1.0

- Added support for Estonian (et), Spanish (es), and Persian (fa)
- Comprehensive test coverage for all new languages
- Fixed language-specific grammar and edge cases
- Updated to 149+ test cases

### 1.0.0

- Initial release with support for English, Thai, French, Japanese, and German
- Full TypeScript support
- Comprehensive test suite with 96+ test cases
- Zero external dependencies
