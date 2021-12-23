import { TestBed } from '@angular/core/testing';

import { OwnerBusinessGuard } from './owner-business.guard';

describe('OwnerBusinessGuard', () => {
  let guard: OwnerBusinessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OwnerBusinessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
