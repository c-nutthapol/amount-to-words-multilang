import { amountToWords } from './src/index';

console.log('=== Extended Edge Cases Testing ===\n');

// Test floating point precision issues
console.log('=== Floating Point Precision ===');
console.log('0.1 + 0.2 =', 0.1 + 0.2, '→', amountToWords(0.1 + 0.2, 'en'));
console.log('1.005 →', amountToWords(1.005, 'en'));
console.log('9.99 →', amountToWords(9.99, 'en'));

// Test large numbers
console.log('\n=== Large Numbers ===');
console.log('999,999.99:', amountToWords(999999.99, 'en'));
console.log('1,000,000.00:', amountToWords(1000000, 'en'));
console.log('1,234,567,890.12:', amountToWords(1234567890.12, 'en'));

// Test Thai special cases
console.log('\n=== Thai Special Cases ===');
console.log('11 →', amountToWords(11, 'th'));
console.log('21 →', amountToWords(21, 'th'));
console.log('121 →', amountToWords(121, 'th'));
console.log('1021 →', amountToWords(1021, 'th'));
console.log('10011 →', amountToWords(10011, 'th'));
console.log('1,000,000.11 →', amountToWords(1000000.11, 'th'));

// Test cents/satang
console.log('\n=== Fractional Currency ===');
console.log('EN - 0.01 →', amountToWords(0.01, 'en'));
console.log('EN - 0.99 →', amountToWords(0.99, 'en'));
console.log('TH - 0.01 →', amountToWords(0.01, 'th'));
console.log('TH - 0.25 →', amountToWords(0.25, 'th'));
console.log('TH - 0.99 →', amountToWords(0.99, 'th'));

// Test boundary values
console.log('\n=== Boundary Values ===');
try {
  console.log('Very large number:', amountToWords(1e15, 'en'));
} catch (error) {
  console.log('Very large number error (expected):', (error as Error).message);
}

try {
  console.log('Infinity:', amountToWords(Infinity, 'en'));
} catch (error) {
  console.log('Infinity error (expected):', (error as Error).message);
}

try {
  console.log('NaN:', amountToWords(NaN, 'en'));
} catch (error) {
  console.log('NaN error (expected):', (error as Error).message);
}
