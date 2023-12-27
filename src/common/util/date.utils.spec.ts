import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  it('날짜 시간 더하기', () => {
    const date = new Date();
    const newDate = DateUtils.addHours(date, 1);
    expect(newDate.getHours()).not.toEqual(date.getHours());
  });

  it('날짜 월 더하기', () => {
    const date = new Date();
    const newDate = DateUtils.addMonths(date, 1);
    expect(newDate.getMonth()).not.toEqual(date.getMonth());
  });
});
