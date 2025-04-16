
interface ClockProps {
  currentTime: Date;
  timeFormat: string;
  dateFormat: string;
}

export default function Clock({ currentTime, timeFormat, dateFormat }: ClockProps) {
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat === "12h"
    };
    return date.toLocaleTimeString('en-US', options);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    };
    
    switch (dateFormat) {
      case 'mdy':
        return date.toLocaleDateString('en-US', options);
      case 'dmy':
        return date.toLocaleDateString('en-GB', options);
      case 'ymd':
        return date.toLocaleDateString('ja-JP', options).replace(/年|月/g, '/').replace('日', '');
      case 'def':
      default:
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
    }
  };

  return (
    <div className="text-center">
      <div className="text-6xl">{formatTime(currentTime)}</div>
      <div className="text-2xl mt-2">{formatDate(currentTime)}</div>
    </div>
  );
}