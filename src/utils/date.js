export function formatDate(d) {
  const timeZoneOffset = new Date(d).getTimezoneOffset() / 60;

  const date = new Date(
    new Date(d).setUTCHours(0, 0, 0, 0) + timeZoneOffset * 60 * 60 * 1000
  );

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
