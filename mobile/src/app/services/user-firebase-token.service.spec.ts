import { TestBed } from '@angular/core/testing';

import { UserFirebaseTokenService } from './user-firebase-token.service';

describe('UserFirebaseTokenService', () => {
  let service: UserFirebaseTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFirebaseTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
