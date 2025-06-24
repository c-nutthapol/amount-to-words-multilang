import { amountToWords } from './src/index';

console.log('=== Multi-Language Currency Conversion Tests ===\n');

const testAmounts = [0, 1, 11, 21, 100, 1234.56, 1000000];

console.log('=== English (EN) ===');
testAmounts.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'en')}`);
});

console.log('\n=== Thai (TH) ===');
testAmounts.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'th')}`);
});

console.log('\n=== French (FR) ===');
testAmounts.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'fr')}`);
});

console.log('\n=== Japanese (JA) ===');
testAmounts.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'ja')}`);
});

console.log('\n=== German (DE) ===');
testAmounts.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'de')}`);
});

// Test special French numbers
console.log('\n=== French Special Numbers ===');
const frenchSpecial = [71, 80, 81, 91, 200, 300, 400];
frenchSpecial.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'fr')}`);
});

// Test German compound numbers
console.log('\n=== German Compound Numbers ===');
const germanSpecial = [25, 37, 99, 101, 1001];
germanSpecial.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'de')}`);
});

// Test Japanese special readings
console.log('\n=== Japanese Special Readings ===');
const japaneseSpecial = [300, 600, 800, 3000, 8000, 10000, 100000000];
japaneseSpecial.forEach(amount => {
  console.log(`${amount}: ${amountToWords(amount, 'ja')}`);
});

console.log('\n=== Cross-Language Comparison (1234.56) ===');
const languages = ['en', 'th', 'fr', 'ja', 'de'] as const;
languages.forEach(lang => {
  console.log(`${lang.toUpperCase()}: ${amountToWords(1234.56, lang)}`);
});
