import { DateTime } from 'luxon';

export function convertToUKDateTimeFormat(isoDateString: string): string {
  const dateTime = DateTime.fromISO(isoDateString, { setZone: true });

  const day = dateTime.day;
  const month = dateTime.month;
  const year = dateTime.year;
  const hours = dateTime.hour;
  const minutes = dateTime.minute;

  return `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year}, ${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}
