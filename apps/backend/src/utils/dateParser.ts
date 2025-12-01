export function stringToDate(raw: string){
  if (!raw || typeof raw !== "string") return undefined;

  const str = raw.trim();

  //1. Try native parsing
  const native = new Date(str);
  if (!isNaN(native.getTime())) return native;

  //2. Handle common numeric formats, m/d/y m-d-y
  const mdy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (mdy) {
    let [_, m, d, y] = mdy.map(Number);
    if (y < 100) y += 2000; //handle 2-digit years
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? undefined : date;
  }

  //3. Handle YYYY-MM-DD or YYYY/M/D
  const ymd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymd) {
    const [_, y, m, d] = ymd.map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
}