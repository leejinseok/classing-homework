export class DateUtils {
  static addMonths(date: Date, months: number) {
    const dateCopy = new Date(date);
    dateCopy.setMonth(dateCopy.getMonth() + months);
    return dateCopy;
  }

  static addHours(date: Date, hours: number) {
    const dateCopy = new Date(date);
    dateCopy.setHours(dateCopy.getHours() + hours);
    return dateCopy;
  }
}
