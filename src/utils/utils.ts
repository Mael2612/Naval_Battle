export function generateRandomNumber(): number {
  return Math.floor(Math.random() * (15 - 5 + 1)) + 5;
}

export function generateRegex(maxDigit: number, maxLetter: string): RegExp {
  if (maxDigit < 1 || maxDigit > 16) {
    throw new Error('maxDigit doit être compris entre 1 et 16.');
  }

  if (!/^[a-zA-Z]$/.test(maxLetter)) {
    throw new Error('maxLetter doit être une lettre unique (A-Z ou a-z).');
  }

  let digitRange: string;

  if (maxDigit < 10) {
    digitRange = `[1-${maxDigit}]`;
  } else {
    digitRange = `([1-9]|1[0-${maxDigit - 10}])`;
  }

  const letterRange = `[a-${maxLetter.toLowerCase()}A-${maxLetter.toUpperCase()}]`;

  const regex = new RegExp(`^${letterRange}${digitRange}$`);

  return regex;
}
