// Helper for flexible/semantic checking of required marking keywords in student answers
export function checkKeywordMatch(keyword: string, studentAnswer: string, conceptsCovered: string[] = []): boolean {
  const normKeyword = keyword.toLowerCase().trim();
  const normStudent = studentAnswer.toLowerCase().trim();

  // 1. Direct inclusion or AI concepts_covered matching
  if (normStudent.includes(normKeyword)) return true;
  if (conceptsCovered.some(c => c.toLowerCase().includes(normKeyword) || normKeyword.includes(c.toLowerCase()))) {
    return true;
  }

  // Helper to strip currency symbols, commas, dots, and spaces
  const cleanNumberText = (text: string) => {
    return text
      .replace(/[₹$£rs\.,\s]/gi, '') // Remove currency symbols, rs, commas, periods, spaces
      .trim();
  };

  // 2. Handle numeric/currency keyword matching (e.g. "₹21,200", "₹2,000", "145 gf", "145 g", "24 months")
  const keywordNumbers = normKeyword.match(/\d+[\d,.]*/g);
  if (keywordNumbers && keywordNumbers.length > 0) {
    const studentNumbers = normStudent.match(/\d+[\d,.]*/g) || [];
    const cleanStudentNumbers = studentNumbers.map(n => cleanNumberText(n));
    
    const allNumbersMatch = keywordNumbers.every(kn => {
      const cleanKn = cleanNumberText(kn);
      if (cleanKn === '') return true;
      return cleanStudentNumbers.includes(cleanKn) || normStudent.includes(cleanKn);
    });

    if (allNumbersMatch) {
      // If keyword is just currency + numbers, e.g., "₹21,200", matching numbers is enough
      if (/^[₹$£\s]*rs[.\s]*\d+/i.test(normKeyword) || /^[₹$£\d,.\s]+$/.test(normKeyword)) {
        return true;
      }
      // Check units if any (e.g. "gf", "g", "months")
      const words = normKeyword.replace(/\d+[\d,.]*/g, '').replace(/[₹$£rs\.,]/gi, '').trim().split(/\s+/);
      const allWordsMatch = words.every(w => {
        if (w.length <= 1) return true;
        const stem = w.replace(/s$/, ''); // singularize
        if (stem === 'centre' && normStudent.includes('center')) return true;
        if (stem === 'center' && normStudent.includes('centre')) return true;
        return normStudent.includes(stem);
      });
      if (allWordsMatch) return true;
    }
  }

  // 3. Handle formula matching (e.g., "Interest = P * n(n+1)/2 * R / (12 * 100)")
  if (normKeyword.includes('=') || normKeyword.includes('*') || normKeyword.includes('/') || normKeyword.includes('+')) {
    const keyChars = ['p', 'n', 'r', '12', '100', '2400', '2', 'i'];
    const presentKeyChars = keyChars.filter(char => normKeyword.includes(char));
    if (presentKeyChars.length >= 3) {
      const matchedCharsCount = presentKeyChars.filter(char => normStudent.includes(char)).length;
      if (matchedCharsCount >= Math.min(presentKeyChars.length, 3)) {
        const mathWords = ['interest', 'maturity', 'value', 'formula', 'principal', 'rd', 'rate', 'deposit', 'months'];
        const studentHasMathContext = mathWords.some(w => normStudent.includes(w));
        if (studentHasMathContext) {
          if (normKeyword.includes('n(n+1)') && (normStudent.includes('n(n+1)') || normStudent.includes('n*(n+1)') || normStudent.includes('n * (n+1)'))) {
            return true;
          }
          if (normStudent.includes('/') && normStudent.includes('*')) {
            return true;
          }
        }
      }
    }
  }

  // 4. Handle common synonym/spelling variations
  if (normKeyword.includes('center') && normStudent.includes('centre')) {
    const replaced = normKeyword.replace('center', 'centre');
    if (normStudent.includes(replaced)) return true;
  }
  if (normKeyword.includes('centre') && normStudent.includes('center')) {
    const replaced = normKeyword.replace('centre', 'center');
    if (normStudent.includes(replaced)) return true;
  }
  if (normKeyword.includes('principle of moments') && (normStudent.includes('principle of moment') || (normStudent.includes('moments') && normStudent.includes('principle')))) {
    return true;
  }

  return false;
}
