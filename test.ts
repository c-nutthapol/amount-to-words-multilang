import { amountToWords } from './src/index';

// Test cases for English
console.log('=== English Tests ===');
console.log('0:', amountToWords(0, 'en'));
console.log('1:', amountToWords(1, 'en'));
console.log('1.01:', amountToWords(1.01, 'en'));
console.log('21:', amountToWords(21, 'en'));
console.log('100:', amountToWords(100, 'en'));
console.log('1234.56:', amountToWords(1234.56, 'en'));
console.log('1000000:', amountToWords(1000000, 'en'));

// Test cases for Thai
console.log('\n=== Thai Tests ===');
console.log('0:', amountToWords(0, 'th'));
console.log('1:', amountToWords(1, 'th'));
console.log('11:', amountToWords(11, 'th'));
console.log('21:', amountToWords(21, 'th'));
console.log('100:', amountToWords(100, 'th'));
console.log('1234.56:', amountToWords(1234.56, 'th'));
console.log('1000000:', amountToWords(1000000, 'th'));

// Test edge cases
console.log('\n=== Edge Cases ===');
try {
  console.log('Invalid locale:', amountToWords(100, 'fr' as any));
} catch (error) {
  console.log('Error (expected):', (error as Error).message);
}

try {
  console.log('Invalid amount:', amountToWords('100' as any, 'en'));
} catch (error) {
  console.log('Error (expected):', (error as Error).message);
}

try {
  console.log('Negative amount:', amountToWords(-100, 'en'));
} catch (error) {
  console.log('Error (expected):', (error as Error).message);
}
