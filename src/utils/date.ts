import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date: string): string => {
  return dayjs(date).format('MMM D, YYYY');
};

export const formatDateTime = (date: string): string => {
  return dayjs(date).format('MMM D, YYYY h:mm A');
};

export const formatRelativeTime = (date: string): string => {
  return dayjs(date).fromNow();
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
};
