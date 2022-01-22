import { OrderByOpeningHoursPipe } from './order-by-opening-hours.pipe';

describe('OrderByOpeningHoursPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderByOpeningHoursPipe();
    expect(pipe).toBeTruthy();
  });
});
