import { CommonUtils } from './common.utils';

describe('CommonUtils', () => {
  it('booleanfy', () => {
    let booleanValue = CommonUtils.booleanify('true');
    expect(booleanValue).toEqual(true);

    booleanValue = CommonUtils.booleanify('false');
    expect(booleanValue).toEqual(false);
  });
});
