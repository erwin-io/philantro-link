import { TestBed } from '@angular/core/testing';

import { RequestTypeService } from './access.service';

describe('RequestTypeService', () => {
  let service: RequestTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
