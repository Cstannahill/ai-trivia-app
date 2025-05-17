export function formatDateString(isoDateString: string): string {
  const date = new Date(isoDateString);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const timeFormatter = new Intl.DateTimeFormat("en-US", options);
  const formattedTime = timeFormatter.format(date);

  const month = date.getMonth() + 1; // JS months are 0-indexed
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2);

  return `${month}-${day}-${year} - ${formattedTime}`;
}
