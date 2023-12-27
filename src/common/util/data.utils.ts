export class DateUtils {
  static addMonths(date: Date, months: number) {
    date.setMonth(date.getMonth() + months);
    return date;
  }

  static addHours(date: Date, hours: number) {
    date.setHours(date.getHours() + hours);
    return date;
  }
}
