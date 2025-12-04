export function getZodiac(birthday: string): string {
  const date = new Date(birthday);
  const year = date.getFullYear();
  const zodiacYears: Record<number, string> = {
    0: "Monkey", 1: "Rooster", 2: "Dog", 3: "Pig",
    4: "Rat", 5: "Ox", 6: "Tiger", 7: "Rabbit",
    8: "Dragon", 9: "Snake", 10: "Horse", 11: "Goat",
  };
  return zodiacYears[year % 12];
}

export function getHoroscope(birthday: string): string {
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const signs = [
    { sign: "Capricorn", start: [1, 1], end: [1, 19] },
    { sign: "Aquarius", start: [1, 20], end: [2, 18] },
    { sign: "Pisces", start: [2, 19], end: [3, 20] },
    { sign: "Aries", start: [3, 21], end: [4, 19] },
    { sign: "Taurus", start: [4, 20], end: [5, 20] },
    { sign: "Gemini", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", start: [6, 21], end: [7, 22] },
    { sign: "Leo", start: [7, 23], end: [8, 22] },
    { sign: "Virgo", start: [8, 23], end: [9, 22] },
    { sign: "Libra", start: [9, 23], end: [10, 22] },
    { sign: "Scorpio", start: [10, 23], end: [11, 21] },
    { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
    { sign: "Capricorn", start: [12, 22], end: [12, 31] },
  ];

  for (const { sign, start, end } of signs) {
    if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) {
      return sign;
    }
  }
  return "Capricorn";
}

export function calculateAge(birthday: string): number {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
