import { TestBed } from '@angular/core/testing';

import { MembresService } from './membres.service';

describe('MembresService', () => {
  let service: MembresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
