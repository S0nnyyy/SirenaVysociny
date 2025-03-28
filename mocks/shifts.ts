import { ShiftDay, ShiftType } from '@/types/emergency';

// Generování dat směn pro aktuální měsíc
const generateShiftData = (): ShiftDay[] => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const result: ShiftDay[] = [];
  
  // Vzor: 1 den A, 1 den B, 1 den C, opakovat
  const shiftPattern: ShiftType[] = ['A', 'B', 'C'];
  
  // Určíme, jaká směna je dnes, abychom mohli správně nastavit celý měsíc
  // Pro ukázku předpokládáme, že 1. den v měsíci je vždy směna A
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysSinceFirstDay = Math.floor((today.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generujeme směny pro celý měsíc
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    // Zajistíme, že směny jdou přesně v pořadí A, B, C bez opakování
    const shiftIndex = (day - 1) % shiftPattern.length;
    
    result.push({
      date: date.toISOString(),
      shift: shiftPattern[shiftIndex]
    });
  }
  
  return result;
};

export const SHIFTS: ShiftDay[] = generateShiftData();