export type LocalDayRange = {
   start: string;
   end: string;
};

export type LocalDayRanges = {
   today: LocalDayRange;
   yesterday: LocalDayRange;
};

export default function getLocalDayRange(date: Date): LocalDayRange {
   const start = new Date(date);
   start.setHours(0, 0, 0, 0);

   const end = new Date(start);
   end.setDate(end.getDate() + 1);

   return {
      start: start.toISOString(),
      end: end.toISOString(),
   };
}

export function getLocalDateKey(date: Date) {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");

   return `${year}-${month}-${day}`;
}

export function getLocalTodayAndYesterdayRanges(referenceDate: Date): LocalDayRanges {
   const yesterday = new Date(referenceDate);
   yesterday.setDate(yesterday.getDate() - 1);

   return {
      today: getLocalDayRange(referenceDate),
      yesterday: getLocalDayRange(yesterday),
   };
}