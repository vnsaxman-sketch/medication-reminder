export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return formatDate(date);
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getCurrentTimeMinutes(): number {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

export function getRelativeDayLabel(dateString: string): string {
  const today = new Date();
  const date = new Date(`${dateString}T12:00:00`);

  const difference = Math.round(
    (new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime() -
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime()) /
      86400000
  );

  if (difference === 0) return 'Today';
  if (difference === 1) return 'Yesterday';

  return date.toLocaleDateString([], {
    weekday: 'short',
  });
}
